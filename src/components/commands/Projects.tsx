import React from "react";
import { projects } from "@/data/projects";

export default function Projects() {
    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl text-gray-300">
            <h2 className="text-xl font-bold text-white mb-2">Meus Projetos</h2>
            {projects.map((project) => (
                <div key={project.id} className="border-l-2 border-gray-600 pl-4 py-1">
                    <h3 className="text-lg text-white font-semibold">{project.nome}</h3>
                    <p className="mt-1 text-sm">{project.descricao}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                        {project.tecnologias.map((tech) => (
                            <span key={tech} className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <div className="mt-3 flex gap-4 text-sm">
                        {project.linkRepositorio && (
                            <a href={project.linkRepositorio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                [Repositório]
                            </a>
                        )}
                        {project.linkLive && (
                            <a href={project.linkLive} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                                [Ver ao vivo]
                            </a>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}