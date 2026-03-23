export interface Example {
  title: string;
  code: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  explanation: string;
  keyPoints: string[];
  examples: Example[];
  practice: {
    problem: string;
    expected_output: string;
    starter_code: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Skill {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  language_id: number;
  skills: Skill[];
}

export interface Data {
  roles: Role[];
}
