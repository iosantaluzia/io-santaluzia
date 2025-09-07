import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqData = [
    {
      question: "Quais são os horários de funcionamento?",
      answer: "Funcionamos de segunda a sexta-feira das 8h às 18h, e aos sábados das 8h às 12h."
    },
    {
      question: "Vocês atendem por convênio?",
      answer: "Sim, atendemos diversos convênios médicos. Entre em contato conosco para verificar se seu plano é aceito."
    },
    {
      question: "Como agendar uma consulta?",
      answer: "Você pode agendar pelo telefone (66) 99721-5000, pelo WhatsApp ou através do nosso portal online."
    },
    {
      question: "A cirurgia de catarata dói?",
      answer: "A cirurgia de catarata é realizada com anestesia local e é praticamente indolor. O procedimento é rápido e seguro."
    },
    {
      question: "Qual a idade mínima para cirurgia refrativa?",
      answer: "Geralmente a partir dos 18 anos, mas é necessário que o grau esteja estável há pelo menos 1 ano. Uma avaliação completa determinará a elegibilidade."
    },
    {
      question: "O ceratocone tem cura?",
      answer: "O ceratocone não tem cura, mas tem tratamentos eficazes como crosslinking e implante de anéis que podem estabilizar e melhorar a visão."
    },
    {
      question: "Preciso de preparo especial para os exames?",
      answer: "Alguns exames podem requerer dilatação da pupila. Recomendamos vir acompanhado e evitar dirigir após exames com dilatação."
    },
    {
      question: "Vocês fazem cirurgia de emergência?",
      answer: "Sim, temos plantão para emergências oftalmológicas. Entre em contato pelo telefone de emergência."
    }
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-20 bg-medical-muted">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2)
        }}
      />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-medical-primary mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-medical-secondary max-w-2xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white rounded-lg border border-medical-border px-6 py-2"
              >
                <AccordionTrigger className="text-left text-medical-primary font-medium hover:text-medical-secondary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-medical-secondary leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mt-12">
          <p className="text-medical-secondary mb-4">
            Não encontrou sua pergunta?
          </p>
          <a 
            href="https://wa.me/5566997215000" 
            className="inline-flex items-center px-6 py-3 bg-medical-primary text-white rounded-lg hover:bg-medical-secondary transition-colors"
          >
            Entre em contato conosco
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQ;