
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">About Me</h2>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <p className="text-gray-600 leading-relaxed">
              I'm a developer passionate about creating innovative digital solutions. With a keen eye for design and a love for clean code, I strive to build applications that make a difference. I enjoy tackling complex problems and turning them into simple, beautiful interfaces.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
