// lib/api.ts



const API_BASE_URL =

  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";



/* =========================================================

   TYPES

========================================================= */



export type ProfileData = {

  name?: string;

  email?: string;

  education: string;

  skills: string[];

  interests: string[];

  experience: string;

  career_goal: string;

  location?: string;

};



export type Job = {

  id: string | number;

  title: string;

  company: string;

  location: string;

  type: string;

  experience: string;

  skills: string[];

  description: string;

  apply_url?: string;

  match?: number;

};



export type GovernmentOpportunity = {

  id: string | number;

  post: string;

  organization: string;

  location: string;

  eligibility: string;

  status: string;

  exam?: string;

  description?: string;

  requirements: string[];

  important_dates?: Record<string, string>;

  official_url?: string;

  match?: number;

};



export type Internship = {

  id: string | number;

  role: string;

  company: string;

  location: string;

  mode: string;

  duration: string;

  stipend?: string;

  skills: string[];

  eligibility: string;

  description: string;

  posted?: string;

  apply_url?: string;

  match?: number;

};



export type SkillGap = {

  name: string;

  category?: string;

  level?: string;

  score?: number;

  status: "have" | "partial" | "missing";

  requirement?: string;

};



export type Resource = {

  id: string | number;

  title: string;

  platform: string;

  skill: string;

  type: string;

  level?: string;

  duration?: string;

  access?: string;

  description: string;

  url?: string;

};



export type RoadmapTask = {

  id: string;

  title: string;

  description?: string;

  duration?: string;

  completed: boolean;

};



export type RoadmapWeek = {

  id: string;

  week: number;

  title: string;

  description?: string;

  tasks: RoadmapTask[];

};



export type AnalysisResult = {

  score?: number;

  skills: string[];

  strengths: string[];

  missingSkills: string[];

  suggestions: string[];

  keywords?: string[];

};



export type ChatMessage = {

  role: "user" | "assistant";

  text: string;

};



export type ChatResponse = {

  response: string;

  message?: string;

};



/* =========================================================

   REQUEST HELPER

========================================================= */



async function request<T>(

  endpoint: string,

  options: RequestInit = {}

): Promise<T> {

  const response = await fetch(

    `${API_BASE_URL}${endpoint}`,

    {

      ...options,

      headers: {

        ...(options.body instanceof FormData

          ? {}

          : {

              "Content-Type": "application/json",

            }),

        ...(options.headers || {}),

      },

      credentials: "include",

      cache: "no-store",

    }

  );



  if (!response.ok) {

    let message =

      `Request failed with status ${response.status}`;



    try {

      const error = await response.json();



      if (typeof error?.detail === "string") {

        message = error.detail;

      } else if (

        Array.isArray(error?.detail)

      ) {

        message = error.detail

          .map(

            (item: {

              msg?: string;

            }) => item.msg

          )

          .filter(Boolean)

          .join(", ");

      } else if (

        typeof error?.message === "string"

      ) {

        message = error.message;

      }

    } catch {

      // Keep default error message.

    }



    throw new Error(message);

  }



  /*

   * Some backend endpoints may return 204 No Content.

   * Avoid trying to parse an empty response as JSON.

   */

  if (response.status === 204) {

    return undefined as T;

  }



  return response.json();

}



/* =========================================================

   AUTH

========================================================= */



export async function login(

  email: string,

  password: string

) {

  return request<{

    access_token?: string;

    token?: string;

    user?: ProfileData;

  }>("/api/auth/login", {

    method: "POST",

    body: JSON.stringify({

      email,

      password,

    }),

  });

}



export async function signup(data: {

  name: string;

  email: string;

  password: string;

}) {

  return request<{

    access_token?: string;

    token?: string;

    user?: ProfileData;

  }>("/api/auth/signup", {

    method: "POST",

    body: JSON.stringify(data),

  });

}



/* =========================================================

   PROFILE

========================================================= */



export async function getProfile() {

  return request<ProfileData>(

    "/api/profile"

  );

}



export async function saveProfile(

  profile: ProfileData

) {

  return request<ProfileData>(

    "/api/profile",

    {

      method: "PUT",

      body: JSON.stringify(profile),

    }

  );

}



/* =========================================================

   AI ANALYSIS

========================================================= */



export async function analyzeProfile(

  profile: ProfileData

) {

  return request<AnalysisResult>(

    "/api/analysis",

    {

      method: "POST",

      body: JSON.stringify({

        profile,

      }),

    }

  );

}



/* =========================================================

   OPPORTUNITIES

========================================================= */



export async function getPrivateJobs(

  params?: {

    search?: string;

    location?: string;

    type?: string;

  }

) {

  const query = new URLSearchParams();



  if (params?.search) {

    query.set("search", params.search);

  }



  if (params?.location) {

    query.set("location", params.location);

  }



  if (params?.type) {

    query.set("type", params.type);

  }



  const suffix = query.toString()

    ? `?${query.toString()}`

    : "";



  return request<Job[]>(

    `/api/opportunities/private${suffix}`

  );

}



export async function getGovernmentJobs(

  params?: {

    search?: string;

    location?: string;

  }

) {

  const query = new URLSearchParams();



  if (params?.search) {

    query.set("search", params.search);

  }



  if (params?.location) {

    query.set("location", params.location);

  }



  const suffix = query.toString()

    ? `?${query.toString()}`

    : "";



  return request<GovernmentOpportunity[]>(

    `/api/opportunities/government${suffix}`

  );

}



export async function getInternships(

  params?: {

    search?: string;

    location?: string;

  }

) {

  const query = new URLSearchParams();



  if (params?.search) {

    query.set("search", params.search);

  }



  if (params?.location) {

    query.set("location", params.location);

  }



  const suffix = query.toString()

    ? `?${query.toString()}`

    : "";



  return request<Internship[]>(

    `/api/opportunities/internships${suffix}`

  );

}



/* =========================================================

   SKILL GAP

========================================================= */



export async function getSkillGap() {

  return request<{

    skills: SkillGap[];

    priorities?: SkillGap[];

  }>("/api/skill-gap");

}



/* =========================================================

   RESOURCES

========================================================= */



export async function getResources(

  params?: {

    skill?: string;

    type?: string;

    search?: string;

  }

) {

  const query = new URLSearchParams();



  if (params?.skill) {

    query.set("skill", params.skill);

  }



  if (params?.type) {

    query.set("type", params.type);

  }



  if (params?.search) {

    query.set("search", params.search);

  }



  const suffix = query.toString()

    ? `?${query.toString()}`

    : "";



  return request<Resource[]>(

    `/api/resources${suffix}`

  );

}



/* =========================================================

   ROADMAP

========================================================= */



export async function getRoadmap() {

  return request<{

    roadmap: RoadmapWeek[];

  }>("/api/roadmap");

}



export async function updateRoadmapTask(

  taskId: string,

  completed: boolean

) {

  return request<RoadmapTask>(

    `/api/roadmap/tasks/${encodeURIComponent(

      taskId

    )}`,

    {

      method: "PATCH",

      body: JSON.stringify({

        completed,

      }),

    }

  );

}



/* =========================================================

   PROGRESS

========================================================= */



export async function getProgress() {

  return request<{

    overall_percentage: number;

    weeks: Array<{

      id: string;

      week: number;

      title: string;

      completed: number;

      total: number;

      percentage: number;

    }>;

  }>("/api/progress");

}



/* =========================================================

   ASK NEXORA

========================================================= */



export async function askNexora(

  message: string,

  history: ChatMessage[] = []

) {

  return request<ChatResponse>(

    "/api/chat",

    {

      method: "POST",

      body: JSON.stringify({

        message,

        history,

      }),

    }

  );

}



/* =========================================================

   CHAT ADAPTER

========================================================= */



/*

 * The Ask Nexora page uses:

 *

 * api.chat([

 *   {

 *     role: "user",

 *     content: "..."

 *   },

 *   {

 *     role: "assistant",

 *     content: "..."

 *   }

 * ])

 *

 * Your backend API currently expects:

 *

 * {

 *   message: "...",

 *   history: [...]

 * }

 *

 * This function converts the frontend conversation format

 * into the backend format.

 *

 * No AI response is generated here.

 * The real backend generates the response.

 */



export async function chat(

  messages: Array<{

    role: "user" | "assistant";

    content: string;

  }>

) {

  const lastMessage =

    messages[messages.length - 1];



  if (!lastMessage) {

    throw new Error(

      "Cannot send an empty conversation."

    );

  }



  const history: ChatMessage[] =

    messages

      .slice(0, -1)

      .map((message) => ({

        role: message.role,

        text: message.content,

      }));



  return askNexora(

    lastMessage.content,

    history

  );

}



/* =========================================================

   RESUME

========================================================= */



export async function analyzeResume(

  file: File

) {

  const formData = new FormData();



  formData.append("file", file);



  return request<AnalysisResult>(

    "/api/resume/analyze",

    {

      method: "POST",

      body: formData,

    }

  );

}



/* =========================================================

   API OBJECT

========================================================= */



/*

 * Pages can now use:

 *

 * api.getProfile()

 * api.getSkillGap()

 * api.analyzeProfile()

 * api.chat()

 * api.getResources()

 * api.getRoadmap()

 * etc.

 *

 * This keeps all backend communication centralized.

 */



export const api = {

  /* Auth */

  login,

  signup,



  /* Profile */

  getProfile,

  saveProfile,



  /* Analysis */

  analyzeProfile,



  /* Opportunities */

  getPrivateJobs,

  getGovernmentJobs,

  getInternships,



  /* Skill Gap */

  getSkillGap,



  /* Resources */

  getResources,



  /* Roadmap */

  getRoadmap,

  updateRoadmapTask,



  /* Progress */

  getProgress,



  /* Ask Nexora */

  askNexora,

  chat,



  /* Resume */

  analyzeResume,

};