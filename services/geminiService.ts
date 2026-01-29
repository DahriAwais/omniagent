
import { GoogleGenAI, Type } from "@google/genai";
import { AgentType, ExecutionPlan, YouTubeVideo } from "../types";

// Initialize AI right before the API call to ensure it always uses the most up-to-date API key from the environment
const getAI = () => {
  // Obtain API key exclusively from process.env.API_KEY
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

const YT_API_KEY = "AIzaSyClmASaLcdl6F8lkjFKbbxTRWpu_Hngk6I";

const fetchYouTubeData = async (query: string): Promise<YouTubeVideo[]> => {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&type=video&key=${YT_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.items) return [];

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description
    }));
  } catch (error) {
    console.error("YouTube API Error:", error);
    return [];
  }
};

export const getExecutionPlan = async (prompt: string, type: AgentType | null): Promise<ExecutionPlan> => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `You are the OmniAgent Strategist. 
  Your goal is to analyze the user's prompt and generate a detailed Execution Plan.
  Identify if the request involves:
  - SLIDE_MASTER (presentations)
  - WEB_ARCHITECT (websites/code)
  - VISUAL_DESIGNER (images/UI design)
  - RESEARCHER (general web research)
  - YOUTUBE_RESEARCHER (video analysis)
  - ROADMAP_STRATEGIST (career paths, learning roadmaps, long-term plans)
  
  For prompts about "roadmap", "carrier", "career", "how to become", "path", use ROADMAP_STRATEGIST.
  Provide a structured JSON plan.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `User Prompt: ${prompt}. ${type ? `Mode already selected: ${type}` : 'Analyze to find best mode.'}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objective: { type: Type.STRING },
            technicalStack: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedComplexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  agent: { type: Type.STRING }
                },
                required: ["id", "title", "description", "agent"]
              }
            }
          },
          required: ["objective", "steps", "technicalStack", "estimatedComplexity"]
        }
      }
    });

    // Access .text property directly from response
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Execution Plan Generation Error:", err);
    throw err;
  }
};

export const getAgentResponse = async (prompt: string, type: AgentType, planContext?: ExecutionPlan) => {
  const ai = getAI();
  let modelName = 'gemini-3-flash-preview';
  let systemInstruction = "You are a specialized AI agent.";
  let responseSchema: any = null;
  let tools: any[] = [];

  const planRef = planContext ? `Follow this approved plan: ${JSON.stringify(planContext.steps)}` : '';

  switch (type) {
    case AgentType.YOUTUBE_RESEARCHER:
      const videos = await fetchYouTubeData(prompt);
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `User Query: ${prompt}. Analyze results: ${JSON.stringify(videos)}.`,
        config: { systemInstruction: "Video market strategist." }
      });
      // Access .text property directly
      return { type, content: { videos, analysis: analysisResponse.text }, explanation: "Analysis complete." };

    case AgentType.ROADMAP_STRATEGIST:
      modelName = 'gemini-3-pro-preview';
      systemInstruction = `You are the Career Architect. Generate a hierarchical tree roadmap. 
      Use a recursive structure where each node has: id, label, description, duration, skills, and optional children. ${planRef}`;
      
      const nodeProperties = {
        id: { type: Type.STRING },
        label: { type: Type.STRING },
        description: { type: Type.STRING },
        duration: { type: Type.STRING },
        skills: { type: Type.ARRAY, items: { type: Type.STRING } },
      };

      responseSchema = {
        type: Type.OBJECT,
        properties: {
          roadmap: {
            type: Type.OBJECT,
            properties: {
              ...nodeProperties,
              children: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    ...nodeProperties,
                    children: { 
                      type: Type.ARRAY, 
                      items: { 
                        type: Type.OBJECT,
                        properties: {
                          ...nodeProperties,
                          children: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: nodeProperties } }
                        },
                        required: ["id", "label", "description", "duration", "skills"]
                      } 
                    }
                  },
                  required: ["id", "label", "description", "duration", "skills"]
                }
              }
            },
            required: ["id", "label", "description", "duration", "skills"]
          },
          explanation: { type: Type.STRING }
        },
        required: ["roadmap", "explanation"]
      };
      break;

    case AgentType.SLIDE_MASTER:
      systemInstruction = `You are a Slide Master. ${planRef}`;
      responseSchema = {
        type: Type.OBJECT,
        properties: {
          slides: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, points: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
          explanation: { type: Type.STRING }
        },
        required: ["slides", "explanation"]
      };
      break;

    case AgentType.WEB_ARCHITECT:
      systemInstruction = `You are a Web Architect. ${planRef}`;
      responseSchema = {
        type: Type.OBJECT,
        properties: { html: { type: Type.STRING }, explanation: { type: Type.STRING } },
        required: ["html", "explanation"]
      };
      break;

    case AgentType.VISUAL_DESIGNER:
      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `Design task: ${prompt}. ${planRef}` }] },
      });
      let imageUrl = '';
      // Find the image part in candidates
      for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      }
      return { type, content: { imageUrl, prompt }, explanation: "Design synthesized." };

    case AgentType.RESEARCHER:
      modelName = 'gemini-3-pro-preview';
      systemInstruction = `Senior Deep Researcher. ${planRef}`;
      // Grounding via Google Search
      tools = [{ googleSearch: {} }];
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction,
        tools: tools.length > 0 ? tools : undefined,
        responseMimeType: responseSchema ? "application/json" : "text/plain",
        responseSchema: responseSchema || undefined
      },
    });

    const text = response.text || "{}";
    if (responseSchema) {
      const parsed = JSON.parse(text);
      return { type, content: parsed, explanation: parsed.explanation || "Execution complete." };
    }

    // Extract grounding chunks for search sources
    return { 
      type, 
      content: { 
        content: text,
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri || chunk.web?.title).filter(Boolean) || []
      }, 
      explanation: "Synthesis finished." 
    };
  } catch (err) {
    console.error(`Agent (${type}) Execution Error:`, err);
    throw err;
  }
};
