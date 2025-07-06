import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Music, Play } from "lucide-react";

export const InstagramSection = () => {
  const guitarCovers = [
    {
      title: "Dreamy Melodies",
      description: "Soulful and dreamy guitar riffs",
      genre: "Dreamy"
    },
    {
      title: "Acoustic Sessions",
      description: "Intimate and emotional performances",
      genre: "Acoustic"
    },
    {
      title: "Melodious Covers",
      description: "Beautiful covers with my own touch",
      genre: "Covers"
    },
    {
      title: "Instrumental Magic",
      description: "Pure guitar artistry and dreamy vibes",
      genre: "Instrumental"
    }
  ];

  return (
    <section id="instagram" className="py-20 min-h-screen bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-primary animate-glow text-white">
            Dreamy Guitar Covers & Melodies
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Check out my dreamy guitar covers and melodious riffs on Instagram. 
            From soulful acoustic sessions to dreamy instrumental pieces, I create my own magical style.
          </p>
        </div>

        {/* Instagram Profile Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-black/50 backdrop-blur border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                    <Instagram className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">@afr.z.x_</h3>
                  <p className="text-white/70 mb-4">
                    Dreamy guitar covers, melodious riffs, and creative content
                  </p>
                  <Button 
                    asChild
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                  >
                    <a 
                      href="https://instagram.com/afr.z.x_" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Instagram className="w-4 h-4" />
                      Follow on Instagram
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guitar Covers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {guitarCovers.map((cover, index) => (
            <Card 
              key={index} 
              className="bg-black/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <div className="w-full h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <Play className="w-8 h-8 text-white/70 group-hover:text-white transition-colors" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full backdrop-blur">
                      {cover.genre}
                    </span>
                  </div>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {cover.title}
                </h4>
                <p className="text-white/60 text-sm">
                  {cover.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-white/70 mb-4 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Live updates on Instagram</span>
          </div>
          <p className="text-white/50 text-sm">
            New dreamy covers every week • Behind-the-scenes content • Guitar and painting passion
          </p>
        </div>
      </div>
    </section>
  );
}; 