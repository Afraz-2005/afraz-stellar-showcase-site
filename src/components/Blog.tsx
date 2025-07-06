import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Music, Play, Guitar, Heart, Loader2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase, Video } from "@/lib/supabase";

export const Blog = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Fetch videos from Supabase
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) {
        throw error;
      }

      setVideos(data || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  // Play video function
  const playVideo = (videoUrl: string) => {
    if (videoUrl.includes('instagram.com')) {
      // Open Instagram links in new tab
      window.open(videoUrl, '_blank');
    } else {
      // Play direct video files in modal
      setSelectedVideo(videoUrl);
      setShowVideoModal(true);
    }
  };

  // Close video modal
  const closeVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
  };

  return (
    <section id="blog" className="py-20 min-h-screen bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Guitar className="w-8 h-8 text-primary animate-pulse" />
            <h2 className="text-3xl font-bold text-primary animate-glow text-white">
              Dreamy Guitar Blog
            </h2>
            <Heart className="w-6 h-6 text-pink-500 animate-pulse" />
          </div>
          <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
            Welcome to my dreamy guitar corner! Here you'll find my latest covers, 
            melodious riffs, and creative sessions. From soulful acoustic pieces to 
            dreamy instrumental magic, each piece tells a story through strings.
          </p>
        </div>

        {/* Instagram Profile Card */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="bg-black/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300">
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
                    Dreamy guitar covers, melodious riffs, and creative content that speaks to the soul
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
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
                    <Button 
                      variant="outline" 
                      className="border-primary/30 text-primary hover:bg-primary/10"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Latest Covers
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guitar Covers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {loading ? (
            // Loading state
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                <p className="text-white/70">Loading dreamy guitar covers...</p>
              </div>
            </div>
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={fetchVideos} variant="outline" className="border-primary/30 text-primary">
                Try Again
              </Button>
            </div>
          ) : videos.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-20">
              <Guitar className="w-12 h-12 text-primary/50 mx-auto mb-4" />
              <p className="text-white/70 mb-2">No guitar covers uploaded yet</p>
              <p className="text-white/50 text-sm">Upload your first dreamy cover through the admin panel!</p>
            </div>
          ) : (
            // Videos grid
            videos.map((video) => (
              <Card 
                key={video.id} 
                className="bg-black/50 backdrop-blur border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 group"
              >
                <CardContent className="p-6">
                  <div className="relative mb-4">
                    {video.video_url.includes('instagram.com') ? (
                      // Instagram preview with click to open
                      <div className="w-full h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 cursor-pointer" onClick={() => playVideo(video.video_url)}>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Instagram className="w-6 h-6 text-white" />
                          </div>
                          <p className="text-white/80 text-xs">Click to view on Instagram</p>
                        </div>
                      </div>
                    ) : video.thumbnail_url ? (
                      // Thumbnail with play button overlay
                      <div className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer group/video" onClick={() => playVideo(video.video_url)}>
                        <img 
                          src={video.thumbnail_url} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      // Default play button
                      <div className="w-full h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/30 transition-all duration-300 cursor-pointer" onClick={() => playVideo(video.video_url)}>
                        <Play className="w-10 h-10 text-white/70 group-hover:text-white transition-colors" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full backdrop-blur">
                        {video.genre}
                      </span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full backdrop-blur">
                        {video.date}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {video.description}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>Guitar Cover</span>
                      <span>{new Date(video.upload_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-white/70 mb-4 animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm">Live updates on Instagram</span>
          </div>
          <p className="text-white/50 text-sm max-w-2xl mx-auto">
            New dreamy covers every week • Behind-the-scenes content • Guitar and painting passion • 
            Late-night creative sessions that capture the dreamy essence of music
          </p>
        </div>
      </div>

      {/* Video Modal - Only for direct video files */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black/90 rounded-lg overflow-hidden">
            <button
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ×
            </button>
            <div className="aspect-video">
              <video
                src={selectedVideo}
                controls
                className="w-full h-full"
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}; 