import { BaseAgent } from './base';
import { RealEstateAgent } from './realEstateAgent';
import { MedicalClinicAgent } from './medicalClinicAgent';

export class AgentFactory {
  private static instances: { [key: string]: BaseAgent } = {};

  public static getAgent(type: string): BaseAgent {
    const agentType = type.toLowerCase();

    // Return existing instance if available
    if (this.instances[agentType]) {
      return this.instances[agentType];
    }

    // Create new instance based on type
    switch (agentType) {
      case 'realestate':
        this.instances[agentType] = new RealEstateAgent();
        break;
      case 'medicalclinic':
        this.instances[agentType] = new MedicalClinicAgent();
        break;
      default:
        throw new Error(`Unknown agent type: ${type}`);
    }

    return this.instances[agentType];
  }

  public static resetAgent(type: string): void {
    const agentType = type.toLowerCase();
    delete this.instances[agentType];
  }
} 