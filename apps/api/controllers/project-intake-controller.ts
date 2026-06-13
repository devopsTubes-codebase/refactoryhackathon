import type { CreateProjectInput, Project } from '../types';

export interface ProjectIntakeController {
  createProject(input: CreateProjectInput): Promise<Project>;
}
