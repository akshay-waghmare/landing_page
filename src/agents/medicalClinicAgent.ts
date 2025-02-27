import { BaseAgent, AgentState } from './base';
import { ChromaClient } from 'chromadb';
import { OpenAIEmbeddingFunction } from 'chromadb';
import { Tool } from '@langchain/core/tools';
import { StateGraph, END } from '@langchain/langgraph/web';
import { z } from 'zod';

export class MedicalClinicAgent extends BaseAgent {
  public vectorStore: ChromaClient;
  public embeddingFunction: OpenAIEmbeddingFunction;

  constructor() {
    super(`You are an AI medical clinic assistant. Your role is to help users with:
      1. Appointment scheduling and management
      2. Medical service information
      3. Doctor and specialist information
      4. Basic medical FAQ and guidance
      
      Guidelines:
      - Always maintain patient privacy and confidentiality
      - Never provide medical diagnosis or treatment advice
      - Direct users to appropriate medical professionals for medical concerns
      - Be clear about emergency situations requiring immediate medical attention
      - Provide accurate information about clinic services and procedures
      - Maintain a professional and empathetic tone
      - Always prioritize patient safety and well-being`
    );

    this.embeddingFunction = new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPENAI_API_KEY || ''
    });

    this.vectorStore = new ChromaClient();

    // Initialize medical clinic specific tools
    this.tools = [
      ...this.tools,
      new AppointmentTool(this),
      new ServiceTool(this),
      new DoctorTool(this),
      new FAQTool(this)
    ];

    // Initialize medical clinic knowledge base
    this.initializeKnowledgeBase();
    
    // Re-initialize agent with updated tools
    this.initializeAgent();
  }

  private async initializeKnowledgeBase() {
    try {
      await this.vectorStore.createCollection({
        name: 'medical_clinic_knowledge',
        metadata: { description: 'Medical clinic knowledge base' },
        embeddingFunction: this.embeddingFunction
      });
    } catch (error) {
      console.log('Collection might already exist:', error);
    }
  }

  protected initializeStateGraph() {
    this.stateGraph = new StateGraph({
      channels: {
        input: { reducer: (a: any, b: any) => b },
        output: { reducer: (a: any, b: any) => b },
      },
    });

    // Add medical clinic specific nodes
    this.stateGraph
      .addNode("input_analysis", {
        call: async (state: AgentState) => this.processInput(state),
      })
      .addNode("appointment_check", {
        call: async (state: AgentState) => this.handleAppointmentCheck(state),
      })
      .addNode("service_info", {
        call: async (state: AgentState) => this.handleServiceInfo(state),
      })
      .addNode("doctor_search", {
        call: async (state: AgentState) => this.handleDoctorSearch(state),
      })
      .addNode("faq_response", {
        call: async (state: AgentState) => this.handleFAQ(state),
      })
      .addNode("response_generation", {
        call: async (state: AgentState) => this.generateResponse(state),
      });

    // Define conditional edges based on task type
    this.stateGraph
      .addEdge("input_analysis", "appointment_check")
      .addEdge("input_analysis", "service_info")
      .addEdge("input_analysis", "doctor_search")
      .addEdge("input_analysis", "faq_response")
      .addEdge("appointment_check", "response_generation")
      .addEdge("service_info", "response_generation")
      .addEdge("doctor_search", "response_generation")
      .addEdge("faq_response", "response_generation")
      .addEdge("response_generation", END);

    this.stateGraph.setEntryPoint("input_analysis");
  }

  private async handleAppointmentCheck(state: AgentState): Promise<AgentState> {
    const appointmentTool = this.tools.find(t => t.name === "check_appointment_availability");
    if (!appointmentTool) return state;

    const result = await appointmentTool.call(state.context.appointmentCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'appointment_check_completed',
    };
  }

  private async handleServiceInfo(state: AgentState): Promise<AgentState> {
    const serviceTool = this.tools.find(t => t.name === "get_service_information");
    if (!serviceTool) return state;

    const result = await serviceTool.call(state.context.serviceCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'service_info_completed',
    };
  }

  private async handleDoctorSearch(state: AgentState): Promise<AgentState> {
    const doctorTool = this.tools.find(t => t.name === "find_doctor");
    if (!doctorTool) return state;

    const result = await doctorTool.call(state.context.doctorCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'doctor_search_completed',
    };
  }

  private async handleFAQ(state: AgentState): Promise<AgentState> {
    const faqTool = this.tools.find(t => t.name === "get_clinic_faq");
    if (!faqTool) return state;

    const result = await faqTool.call(state.context.faqCriteria || {});
    
    return {
      ...state,
      tools_output: [...(state.tools_output || []), result],
      workflow_state: 'faq_completed',
    };
  }

  public filterAppointmentSlots(results: any, timePreference?: string): any {
    // Implement appointment slot filtering logic
    const slots = results.documents?.[0] || [];
    if (!timePreference) return slots;

    // Filter based on time preference
    return slots.filter((slot: any) => {
      const hour = new Date(slot.datetime).getHours();
      switch (timePreference.toLowerCase()) {
        case 'morning':
          return hour >= 8 && hour < 12;
        case 'afternoon':
          return hour >= 12 && hour < 17;
        case 'evening':
          return hour >= 17 && hour < 20;
        default:
          return true;
      }
    });
  }

  public formatServiceInformation(results: any): any {
    // Implement service information formatting
    const services = results.documents?.[0] || [];
    return services.map((service: any) => ({
      name: service.name,
      description: service.description,
      duration: service.duration,
      cost: service.cost,
      preparation: service.preparation,
      aftercare: service.aftercare,
    }));
  }

  public formatDoctorInformation(results: any): any {
    // Implement doctor information formatting
    const doctors = results.documents?.[0] || [];
    return doctors.map((doctor: any) => ({
      name: doctor.name,
      specialty: doctor.specialty,
      qualifications: doctor.qualifications,
      languages: doctor.languages,
      availability: doctor.availability,
      bio: doctor.bio,
    }));
  }

  public formatFAQResponse(results: any): any {
    // Implement FAQ response formatting
    const faqs = results.documents?.[0] || [];
    return faqs.map((faq: any) => ({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      lastUpdated: faq.lastUpdated,
    }));
  }
}

class AppointmentTool extends Tool {
  name = "check_appointment_availability";
  description = "Check available appointment slots";
  schema = z.object({ input: z.string().optional() }).transform(val => val.input);
  constructor(private agent: MedicalClinicAgent) { 
    super();
  }
  returnDirect = false;
  async _call(input: string) {
    const { date, specialtyType, doctorId, timePreference } = JSON.parse(input || '{}');
    const collection = await this.agent.vectorStore.getCollection({
      name: 'medical_clinic_knowledge',
      embeddingFunction: this.agent.embeddingFunction
    });
    const query = `appointments ${date} ${specialtyType || ''} ${doctorId || ''}`;
    const where: any = { type: { $eq: 'appointment_slots' } };
    if (specialtyType) where.specialty = { $eq: specialtyType };
    if (doctorId) where.doctor_id = { $eq: doctorId };
    const results = await collection.query({
      queryTexts: [query],
      nResults: 5,
      where
    });
    return this.agent.filterAppointmentSlots(results, timePreference);
  }
}

class ServiceTool extends Tool {
  name = "get_service_information";
  description = "Get information about medical services";
  schema = z.object({ input: z.string().optional() }).transform(val => val.input);
  constructor(private agent: MedicalClinicAgent) { 
    super();
  }
  returnDirect = false;
  async _call(input: string) {
    const { serviceName, includeDetails } = JSON.parse(input || '{}');
    const collection = await this.agent.vectorStore.getCollection({
      name: 'medical_clinic_knowledge',
      embeddingFunction: this.agent.embeddingFunction
    });
    const details = includeDetails?.join(' ') || '';
    const results = await collection.query({
      queryTexts: [`${serviceName} service information ${details}`],
      nResults: 3,
      where: { type: { $eq: 'medical_service' } }
    });
    return this.agent.formatServiceInformation(results);
  }
}

class DoctorTool extends Tool {
  name = "find_doctor";
  description = "Find doctor information";
  schema = z.object({ input: z.string().optional() }).transform(val => val.input);
  constructor(private agent: MedicalClinicAgent) { 
    super();
  }
  returnDirect = false;
  async _call(input: string) {
    const { specialty, name, language, gender } = JSON.parse(input || '{}');
    const collection = await this.agent.vectorStore.getCollection({
      name: 'medical_clinic_knowledge',
      embeddingFunction: this.agent.embeddingFunction
    });
    const query = `doctor ${specialty || ''} ${name || ''} ${language || ''} ${gender || ''}`;
    const where: any = { type: { $eq: 'doctor_info' } };
    if (specialty) where.specialty = { $eq: specialty };
    if (language) where.languages = { $contains: language };
    if (gender) where.gender = { $eq: gender };
    const results = await collection.query({
      queryTexts: [query],
      nResults: 5,
      where
    });
    return this.agent.formatDoctorInformation(results);
  }
}

class FAQTool extends Tool {
  name = "get_clinic_faq";
  description = "Get answers to frequently asked questions";
  schema = z.object({ input: z.string().optional() }).transform(val => val.input);
  constructor(private agent: MedicalClinicAgent) { 
    super();
  }
  returnDirect = false;
  async _call(input: string) {
    const { topic, specific_question } = JSON.parse(input || '{}');
    const collection = await this.agent.vectorStore.getCollection({
      name: 'medical_clinic_knowledge',
      embeddingFunction: this.agent.embeddingFunction
    });
    const query = specific_question || topic;
    const results = await collection.query({
      queryTexts: [query],
      nResults: 3,
      where: {
        type: { $eq: 'faq' },
        topic: { $eq: topic }
      }
    });
    return this.agent.formatFAQResponse(results);
  }
} 