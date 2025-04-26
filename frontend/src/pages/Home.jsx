import { useNavigate } from "react-router-dom";
import {
  FileText,
  Image,
  Video,
  AudioLines,
  Shield,
  ChevronRight,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const detectionOptions = [
    {
      title: "Text Detection",
      description:
        "Analyze news articles and text content for AI-generated fake information",
      path: "/text-analysis",
      icon: <FileText className="h-10 w-10" />,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Audio Detection",
      description:
        "Detect voice cloning and AI-generated speech in audio recordings",
      path: "/audio-analysis",
      icon: <AudioLines className="h-10 w-10" />,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Image Detection",
      description:
        "Identify manipulated or AI-generated images and detect tampering",
      path: "/image-analysis",
      icon: <Image className="h-10 w-10" />,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Video Detection",
      description:
        "Analyze videos for deepfakes, face swaps, and other manipulations",
      path: "/video-analysis",
      icon: <Video className="h-10 w-10" />,
      color: "bg-amber-500/10 text-amber-500",
    },
  ];

  return (
    <div className="container mx-auto px-4 pb-16">
      <section className="py-16 md:py-24 flex flex-col items-center text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-block mx-auto">
            <div className="bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium flex items-center gap-1">
              <Shield className="h-4 w-4" />
              <span>AI-powered deepfake detection technology</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Detect Deepfakes with{" "}
            <span className="text-primary">Fake News Detector</span>
          </h1>

          <p className="text-xl text-muted-foreground">
            Our advanced AI technology helps you identify manipulated media
            across text, audio, images, and videos with high accuracy and
            detailed explanations.
          </p>

          <div className="flex flex-col flex-wrap justify-center items-center gap-4 pt-4">
            <button
              onClick={() => navigate("/text-analysis")}
              className="flex justify-center w-2xs gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-lg"
            >
              Start Detection
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              variant="outline"
              size="lg"
              onClick={() => navigate("/about")}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Detection Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {detectionOptions.map((option) => (
            <div
              key={option.title}
              className="glass-card p-6 rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer"
              onClick={() => navigate(option.path)}
            >
              <div className="flex gap-5">
                <div className={`${option.color} p-3 rounded-lg`}>
                  {option.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{option.title}</h3>
                  <p className="text-muted-foreground">{option.description}</p>
                  <button
                  variant="link"
                    onClick={() => navigate(option.path)}
                    className="flex justify-center items-center w-2xs gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-0 py-2 rounded-lg text-lg"
                  >
                    Try now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="glass-card p-8 rounded-xl">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="space-y-4 md:w-1/2">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-muted-foreground">
                Our deepfake detection platform uses advanced AI algorithms to
                analyze content across multiple media types. The system looks
                for artifacts, inconsistencies, and manipulation markers that
                may not be visible to the human eye.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Neural network analysis of content patterns</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Identification of manipulation artifacts</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Detailed reports with confidence scores</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                  <span>Continuous learning from new deepfake techniques</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden bg-secondary/30 p-1">
                <div className="aspect-video rounded-md bg-deepfake-blue/40 flex items-center justify-center">
                  <div className="text-center p-10">
                    <div className="bg-primary/20 inline-block rounded-full p-5 mb-4">
                      <Shield className="h-10 w-10 text-primary" />
                    </div>
                    <p className="text-muted-foreground">
                      Visualization of detection process
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
