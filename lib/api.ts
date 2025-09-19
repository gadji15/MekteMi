// API utilities for Laravel backend integration
// This file contains mock implementations that should be replaced with actual Laravel API calls

export interface PilgrimRegistration {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  country: string
  accommodationType: string
  specialNeeds: string
  status: "pending" | "confirmed" | "cancelled"
  registrationDate: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

// Mock API service - replace with actual Laravel endpoints
export const apiService = {
  // Pilgrim registration endpoints
  async registerPilgrim(
    data: Omit<PilgrimRegistration, "id" | "status" | "registrationDate">,
  ): Promise<ApiResponse<PilgrimRegistration>> {
    // TODO: Replace with actual Laravel API call
    // const response = await fetch('/api/pilgrims', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${tokenStorage.get()}`
    //   },
    //   body: JSON.stringify(data)
    // })

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

    const pilgrim: PilgrimRegistration = {
      id: Date.now().toString(),
      ...data,
      status: "pending",
      registrationDate: new Date().toISOString(),
    }

    return {
      data: pilgrim,
      message: "Inscription enregistrée avec succès",
      success: true,
    }
  },

  async getPilgrimRegistrations(): Promise<ApiResponse<PilgrimRegistration[]>> {
    // TODO: Replace with actual Laravel API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockRegistrations: PilgrimRegistration[] = [
      {
        id: "1",
        firstName: "Amadou",
        lastName: "Diop",
        email: "amadou.diop@email.com",
        phone: "+221 77 123 45 67",
        city: "Dakar",
        country: "senegal",
        accommodationType: "family",
        specialNeeds: "",
        status: "confirmed",
        registrationDate: "2025-01-10T10:00:00Z",
      },
      {
        id: "2",
        firstName: "Fatou",
        lastName: "Sall",
        email: "fatou.sall@email.com",
        phone: "+221 76 987 65 43",
        city: "Thiès",
        country: "senegal",
        accommodationType: "hotel",
        specialNeeds: "Mobilité réduite",
        status: "pending",
        registrationDate: "2025-01-12T14:30:00Z",
      },
    ]

    return {
      data: mockRegistrations,
      message: "Inscriptions récupérées avec succès",
      success: true,
    }
  },

  async updatePilgrimStatus(
    id: string,
    status: PilgrimRegistration["status"],
  ): Promise<ApiResponse<PilgrimRegistration>> {
    // TODO: Replace with actual Laravel API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    return {
      data: {
        id,
        firstName: "Amadou",
        lastName: "Diop",
        email: "amadou.diop@email.com",
        phone: "+221 77 123 45 67",
        city: "Dakar",
        country: "senegal",
        accommodationType: "family",
        specialNeeds: "",
        status,
        registrationDate: "2025-01-10T10:00:00Z",
      },
      message: `Statut mis à jour: ${status}`,
      success: true,
    }
  },

  // Schedule endpoints
  async getSchedules(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      data: [],
      message: "Horaires récupérés",
      success: true,
    }
  },

  // Notification endpoints
  async getNotifications(): Promise<ApiResponse<any[]>> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return {
      data: [],
      message: "Notifications récupérées",
      success: true,
    }
  },

  async sendNotification(data: { title: string; message: string; type: string }): Promise<ApiResponse<any>> {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      data: { id: Date.now().toString(), ...data },
      message: "Notification envoyée",
      success: true,
    }
  },
}
