interface ClassicTemplateProps {
  data: any;
  template: any;
}

export default function ClassicTemplate({ data, template }: ClassicTemplateProps) {
  if (!data) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>Start building your resume to see the preview</p>
      </div>
    );
  }

  return (
    <div className="classic-template">
      {/* Header */}
      <div className="header text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data.personalInfo?.fullName || 'Your Name'}
        </h1>
        <div className="text-gray-600 text-sm">
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
          <div className="text-sm text-gray-600 mt-2">
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

      {/* Summary */}
      {data.summary && (
        <div className="section mb-4">
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-2 border-b border-gray-300 pb-1">
            Professional Summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <div className="section mb-4">
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Professional Experience
          </h2>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <div className="text-gray-700 font-medium text-sm">{exp.company}</div>
                </div>
                <div className="text-gray-600 text-sm">{exp.duration}</div>
              </div>
              {exp.description && (
                <p className="text-gray-700 text-sm mb-2">{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {exp.achievements.map((achievement: string, i: number) => (
                    <li key={i}>{achievement}</li>
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
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <div className="text-gray-700 font-medium text-sm">{edu.institution}</div>
                </div>
                <div className="text-gray-600 text-sm">{edu.year}</div>
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
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Technical</h4>
                <div className="text-sm text-gray-700">
                  {data.skills.technical.join(' • ')}
                </div>
              </div>
            )}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Soft Skills</h4>
                <div className="text-sm text-gray-700">
                  {data.skills.soft.join(' • ')}
                </div>
              </div>
            )}
          </div>
          {data.skills.languages && data.skills.languages.length > 0 && (
            <div className="mt-3">
              <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
              <div className="text-sm text-gray-700">
                {data.skills.languages.join(' • ')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="section mb-4">
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Projects
          </h2>
          {data.projects.map((project: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{project.name}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
              {project.description && (
                <p className="text-gray-700 text-sm mb-2">{project.description}</p>
              )}
              {project.technologies && project.technologies.length > 0 && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {data.certifications && data.certifications.length > 0 && (
        <div className="section">
          <h2 className="section-title text-gray-900 font-bold text-sm uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Certifications
          </h2>
          {data.certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                  <div className="text-gray-600 text-sm">{cert.issuer}</div>
                </div>
                <div className="text-gray-600 text-sm">{cert.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
