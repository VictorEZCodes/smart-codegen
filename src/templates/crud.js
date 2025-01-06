export const crudTemplates = {
  service: (modelName) => `import axios from 'axios';

// Types
export interface ${modelName} {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  // Add your model properties here
}

export interface Create${modelName}Dto {
  // Add properties required for creation
}

export interface Update${modelName}Dto {
  // Add properties that can be updated
}

export interface Query${modelName}Params {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Service
export class ${modelName}Service {
  private static instance: ${modelName}Service;
  private baseURL: string;

  private constructor() {
    this.baseURL = process.env.API_URL || '/api/${modelName.toLowerCase()}s';
  }

  public static getInstance(): ${modelName}Service {
    if (!${modelName}Service.instance) {
      ${modelName}Service.instance = new ${modelName}Service();
    }
    return ${modelName}Service.instance;
  }

  async getAll(params?: Query${modelName}Params): Promise<${modelName}[]> {
    try {
      const response = await axios.get(this.baseURL, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getById(id: number): Promise<${modelName}> {
    try {
      const response = await axios.get(\`\${this.baseURL}/\${id}\`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async create(data: Create${modelName}Dto): Promise<${modelName}> {
    try {
      const response = await axios.post(this.baseURL, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async update(id: number, data: Update${modelName}Dto): Promise<${modelName}> {
    try {
      const response = await axios.put(\`\${this.baseURL}/\${id}\`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axios.delete(\`\${this.baseURL}/\${id}\`);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error(\`${modelName}Service Error: \${message}\`);
    } else {
      console.error('An unexpected error occurred:', error);
    }
  }
}

export const ${modelName.toLowerCase()}Service = ${modelName}Service.getInstance();
`,

  hook: (modelName) => `import { useState, useEffect, useCallback } from 'react';
import { ${modelName}, ${modelName}Service, Query${modelName}Params } from './${modelName.toLowerCase()}.service';

interface Use${modelName}Options {
  initialData?: ${modelName};
  autoFetch?: boolean;
}

interface Use${modelName}Return {
  data: ${modelName} | null;
  list: ${modelName}[];
  loading: boolean;
  error: Error | null;
  fetch: (id: number) => Promise<void>;
  fetchAll: (params?: Query${modelName}Params) => Promise<void>;
  create: (data: Create${modelName}Dto) => Promise<${modelName}>;
  update: (id: number, data: Update${modelName}Dto) => Promise<${modelName}>;
  remove: (id: number) => Promise<void>;
  reset: () => void;
}

export const use${modelName} = (options: Use${modelName}Options = {}): Use${modelName}Return => {
  const [data, setData] = useState<${modelName} | null>(options.initialData || null);
  const [list, setList] = useState<${modelName}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${modelName.toLowerCase()}Service.getById(id);
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async (params?: Query${modelName}Params) => {
    try {
      setLoading(true);
      setError(null);
      const results = await ${modelName.toLowerCase()}Service.getAll(params);
      setList(results);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (createData: Create${modelName}Dto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${modelName.toLowerCase()}Service.create(createData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: number, updateData: Update${modelName}Dto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await ${modelName.toLowerCase()}Service.update(id, updateData);
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await ${modelName.toLowerCase()}Service.delete(id);
      setData(null);
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setList([]);
    setError(null);
  }, []);

  useEffect(() => {
    if (options.autoFetch) {
      fetchAll();
    }
  }, [fetchAll, options.autoFetch]);

  return {
    data,
    list,
    loading,
    error,
    fetch,
    fetchAll,
    create,
    update,
    remove,
    reset
  };
};
`
};