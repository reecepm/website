import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect } from "react";
import Overview from "../../components/work/project/Overview";
import { Project, projects } from "../../data/projects";

interface Props {
  project: Project;
}

interface IParams extends ParsedUrlQuery {
  id: string;
}

const Project: React.FC<Props> = ({ project }) => {
  return <Overview project={project} />;
};

export default Project;

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projects.map(({ id }) => ({
    params: { id },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as IParams;

  const project = projects.find((project) => project.id === id);
  return { props: { project } };
};
