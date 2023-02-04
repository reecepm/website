import { projects } from "../../../data/projects";

const Head = async ({ params }: { params: { id: string } }) => {
  const project = projects.find((project) => project.id === params.id);

  const title = `Reece Martin - ${project?.name || "Project"}`;

  return (
    <>
      <title>{title}</title>
    </>
  );
};

export default Head;
