export type ProblemDetails = {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
};

export const problemJson = (problem: ProblemDetails) => ({
  type: problem.type ?? 'about:blank',
  title: problem.title,
  status: problem.status,
  detail: problem.detail,
  instance: problem.instance,
});
