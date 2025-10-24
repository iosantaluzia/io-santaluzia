import React from 'react';

interface SEOStructuredDataProps {
  type?: 'Organization' | 'MedicalOrganization' | 'LocalBusiness' | 'Service';
  data?: any;
}

const SEOStructuredData = ({ type = 'MedicalOrganization', data }: SEOStructuredDataProps) => {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": ["MedicalOrganization", "LocalBusiness", "Organization"],
      "name": "Instituto de Olhos Santa Luzia",
      "description": "Instituto de Olhos Santa Luzia em Sinop/MT - Especialistas em cirurgia de catarata, cirurgia refrativa e tratamento de ceratocone com tecnologia de ponta.",
      "url": "https://institutodeolhossantaluzia.com.br",
      "logo": "/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png",
      "image": "/uploads/26442ffb-6359-4e38-a0f7-eaddfc7505f1.png",
      "telephone": "+55 66 99721-5000",
      "email": "contato@institutodeolhossantaluzia.com.br",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Avenida dos Tarumãs, 930",
        "addressLocality": "Sinop",
        "addressRegion": "MT",
        "postalCode": "78550-001",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -11.8649,
        "longitude": -55.5047
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "18:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "08:00",
          "closes": "12:00"
        }
      ],
      "medicalSpecialty": [
        "Ophthalmology",
        "Cataract Surgery",
        "Refractive Surgery",
        "Keratoconus Treatment"
      ],
      "serviceArea": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": -11.8649,
          "longitude": -55.5047
        },
        "geoRadius": "100000"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Serviços Oftalmológicos",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Cirurgia de Catarata",
              "description": "Cirurgia moderna de catarata com lentes intraoculares premium"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Cirurgia Refrativa",
              "description": "Correção de miopia, hipermetropia e astigmatismo com laser"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "Tratamento de Ceratocone",
              "description": "Crosslinking e implante de anéis intraestromais"
            }
          }
        ]
      },
      "sameAs": [
        "https://www.instagram.com/io.santaluzia/",
        "https://www.facebook.com/institudodeolhossantaluzia"
      ]
    };

    return { ...baseData, ...data };
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
};

export default SEOStructuredData;
