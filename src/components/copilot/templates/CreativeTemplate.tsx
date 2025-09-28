interface CreativeTemplateProps {
  data: any;
  template: any;
}

export default function CreativeTemplate({ data, template }: CreativeTemplateProps) {
  if (!data) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Start building your resume to see the preview</p>
      </div>
    );
  }

  return (
    <div className="creative-template">
      {/* Header */}
      <div className="header mb-6 relative">
        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white p-6 rounded-lg">
          <h1 className="text-2xl font-bold mb-2">
            {data.personalInfo?.fullName || 'Your Name'}
          </h1>
          <div className="text-purple-100 text-sm">
            {data.personalInfo?.email && (
              <span>{data.personalInfo.email}</span>
            )}
            {data.personalInfo?.phone && (
              <span className="mx-2">•</span>
            )}
            {data.personalInfo?.phone && (
              <span>{data.personalInfo.phone}</span>
            )}
            {data.personalInfo?.location && (
              <span className="mx-2">•</span>
            )}
            {data.personalInfo?.location && (
              <span>{data.personalInfo.location}</span>
            )}
          </div>
          {(data.personalInfo?.linkedin || data.personalInfo?.github || data.personalInfo?.portfolio) && (
            <div className="text-purple-100 text-sm mt-2">
              {data.personalInfo?.linkedin && (
                <span>LinkedIn: {data.personalInfo.linkedin}</span>
              )}
              {data.personalInfo?.github && (
                <span className="mx-2">•</span>
              )}
              {data.personalInfo?.github && (
                <span>GitHub: {data.personalInfo.github}</span>
              )}
              {data.personalInfo?.portfolio && (
                <span className="mx-2">•</span>
              )}
              {data.personalInfo?.portfolio && (
                <span>Portfolio: {data.personalInfo.portfolio}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className="section mb-4">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-2 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            About Me
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed bg-purple-50 p-3 rounded">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="section mb-4">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            Experience
          </h2>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4 border-l-4 border-orange-400 pl-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <div className="text-purple-600 font-medium text-sm">{exp.company}</div>
                </div>
                <div className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">{exp.duration}</div>
              </div>
              {exp.description && (
                <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-none text-sm text-gray-700 space-y-1">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2">▶</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="section mb-4">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            Education
          </h2>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-3 border-l-4 border-orange-400 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <div className="text-purple-600 font-medium text-sm">{edu.institution}</div>
                </div>
                <div className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">{edu.year}</div>
              </div>
              {edu.gpa && (
                <div className="text-sm text-gray-700 mt-1">GPA: {edu.gpa}</div>
              )}
              {edu.relevant_courses && edu.relevant_courses.length > 0 && (
                <div className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Relevant Coursework:</span> {edu.relevant_courses.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && (
        <div className="section mb-4">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Technical Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {data.skills.technical.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Soft Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {data.skills.soft.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          {data.skills.languages && data.skills.languages.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
              <div className="flex flex-wrap gap-1">
                {data.skills.languages.map((language: string, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="section mb-4">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            Projects
          </h2>
          {data.projects.map((project: any, index: number) => (
            <div key={index} className="mb-3 border-l-4 border-orange-400 pl-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 text-sm hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
              {project.description && (
                <p className="text-gray-700 text-sm mb-2">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="section">
          <h2 className="section-title text-purple-600 font-bold text-sm uppercase tracking-wide mb-3 flex items-center">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
            Certifications
          </h2>
          {data.certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-2 border-l-4 border-orange-400 pl-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <div className="text-gray-600 text-sm">{cert.issuer}</div>
                </div>
                <div className="text-gray-600 text-sm bg-gray-100 px-2 py-1 rounded">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
