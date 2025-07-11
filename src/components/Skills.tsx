
import { Card, CardContent } from "@/components/ui/card";

export const Skills = () => {
  const skills = [
    {
      category: "Frontend",
      items: ["React", "TypeScript", "Tailwind CSS", "Next.js", "HTML", "CSS", "JavaScript"],	
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "MongoDB", "PostgreSQL"],
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "VS Code", "Figma", "photoshop", "Canva"],	
    },
  ];

  return (
    <section id="skills" className="py-20 min-h-screen bg-transparent">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-primary animate-glow text-white">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {skills.map((skill) => (
            <Card key={skill.category} className="bg-black/50 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-white animate-glow text-center">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skill.items.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-secondary/70 rounded-full text-sm text-white/80 animate-glow"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
