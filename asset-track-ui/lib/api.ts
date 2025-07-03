const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export interface Asset {
  id: string
  symbol: string
  name: string
  type: "STOCK" | "MUTUAL_FUND" | "CRYPTO" | "BOND"
  sector: string
  quantity: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface PredictionRequest {
  symbol: string
  days: number
  model: "LSTM" | "ARIMA" | "LINEAR_REGRESSION"
}

export interface PredictionResponse {
  symbol: string
  predictions: Array<{
    date: string
    predictedPrice: number
    confidence: number
  }>
  accuracy: number
  model: string
}

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "API request failed")
      }

      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  // Auth endpoints
  async login(credentials: { emailOrUsername: string; password: string }) {
    return this.request<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async register(userData: { username: string; email: string; password: string }) {
    return this.request<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async logout() {
    return this.request("/auth/logout", { method: "POST" })
  }

  // Asset endpoints
  async getAssets() {
    return this.request<Asset[]>("/assets")
  }

  async createAsset(asset: Omit<Asset, "id" | "userId" | "createdAt" | "updatedAt">) {
    return this.request<Asset>("/assets", {
      method: "POST",
      body: JSON.stringify(asset),
    })
  }

  async updateAsset(id: string, asset: Partial<Asset>) {
    return this.request<Asset>(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(asset),
    })
  }

  async deleteAsset(id: string) {
    return this.request(`/assets/${id}`, { method: "DELETE" })
  }

  // Portfolio endpoints
  async getPortfolioSummary() {
    return this.request<{
      totalValue: number
      totalGain: number
      totalGainPercent: number
      assetCount: number
    }>("/portfolio/summary")
  }

  async getPortfolioHistory(timeframe: string) {
    return this.request<Array<{ date: string; value: number }>>(`/portfolio/history?timeframe=${timeframe}`)
  }

  // Prediction endpoints
  async predictStockPrice(request: PredictionRequest) {
    return this.request<PredictionResponse>("/predictions/stock", {
      method: "POST",
      body: JSON.stringify(request),
    })
  }

  async getPredictionHistory(symbol: string) {
    return this.request<PredictionResponse[]>(`/predictions/history/${symbol}`)
  }

  // Market data endpoints
  async getMarketData(symbol: string, timeframe: string) {
    return this.request<Array<{ date: string; price: number; volume: number }>>(
      `/market/${symbol}?timeframe=${timeframe}`,
    )
  }

  async searchStocks(query: string) {
    return this.request<Array<{ symbol: string; name: string; sector: string }>>(`/market/search?q=${query}`)
  }
}

export const apiClient = new ApiClient()
