"use client"
import React from 'react';

const HeroCompanies = () => {
  // Company logos data with SVG paths or you can use image URLs
  const companies = [
    {
      name: "Google",
      logo: "https://www.vectorlogo.zone/logos/google/google-icon.svg"
    },
    {
      name: "Microsoft",
      logo: "https://www.vectorlogo.zone/logos/microsoft/microsoft-icon.svg"
    },
    {
      name: "Amazon",
      logo: "https://www.vectorlogo.zone/logos/amazon/amazon-icon.svg"
    },
    {
      name: "Meta",
      logo: "https://www.vectorlogo.zone/logos/meta/meta-icon.svg"
    },
    {
      name: "Apple",
      logo: "https://www.vectorlogo.zone/logos/apple/apple-icon.svg"
    },
    {
      name: "Netflix",
      logo: "https://www.vectorlogo.zone/logos/netflix/netflix-icon.svg"
    },
    {
      name: "Tesla",
      logo: "https://www.vectorlogo.zone/logos/tesla/tesla-icon.svg"
    },
    {
      name: "Adobe",
      logo: "https://www.vectorlogo.zone/logos/adobe/adobe-icon.svg"
    },
    {
      name: "IBM",
      logo: "https://www.vectorlogo.zone/logos/ibm/ibm-icon.svg"
    },
    {
      name: "Oracle",
      logo: "https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg"
    },
    {
      name: "Salesforce",
      logo: "https://www.vectorlogo.zone/logos/salesforce/salesforce-icon.svg"
    },
    {
      name: "Intel",
      logo: "https://www.vectorlogo.zone/logos/intel/intel-icon.svg"
    }
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="w-full bg-black/[0.96] py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Animated Slider */}
        <div className="relative">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/[0.96] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/[0.96] to-transparent z-10"></div>

          {/* Slider container */}
          <div className="flex overflow-hidden">
            <div className="flex animate-scroll hover:pause-animation">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 mx-6 flex items-center justify-center"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-8 w-8 md:h-10 md:w-10 object-contain opacity-60"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=random&size=64`;
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        .pause-animation:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default HeroCompanies;
