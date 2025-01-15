import { API_ENDPOINTS } from "@/shared/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface CrudOptions {
  dbName: string;
  collectionName: string;
  token?: string | null;
  query?: Record<string, any>;
  id?: string;
}

export default function useCrud({
  dbName,
  collectionName,
  token,
  query,
  id,
}: CrudOptions) {
  const queryClient = useQueryClient();

  // Read (누구나 볼 수 있음)
  const fetchData = useQuery({
    queryKey: ["data", dbName, collectionName, id || query],
    queryFn: async () => {
      let apiUrl = `${API_ENDPOINTS.DATA.READ}?dbName=${dbName}&collectionName=${collectionName}`;

      if (id) {
        // ID로 검색할 경우
        apiUrl += `&id=${id}`;
      } else if (query) {
        // Query로 검색할 경우
        const queryString = encodeURIComponent(JSON.stringify(query));
        apiUrl += `&query=${queryString}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Create (토큰 필요)
  const createData = useMutation({
    mutationFn: async (data: object) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await fetch(API_ENDPOINTS.DATA.CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dbName, collectionName, data }),
      });
      if (!response.ok) {
        throw new Error("Failed to create data");
      }
      const result = await response.json();
      return result.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data", dbName, collectionName],
        exact: true, // 특정 쿼리만 무효화
      });
    },
  });

  // Update (토큰 필요)
  const updateData = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: object }) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await fetch(API_ENDPOINTS.DATA.UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dbName, collectionName, id, updates }),
      });
      if (!response.ok) {
        throw new Error("Failed to update data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data", dbName, collectionName],
        exact: true, // 특정 쿼리만 무효화
      });
    },
  });

  // Delete (토큰 필요)
  const deleteData = useMutation({
    mutationFn: async (id: string) => {
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const response = await fetch(API_ENDPOINTS.DATA.DELETE, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dbName, collectionName, id }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["data", dbName, collectionName],
        exact: true, // 특정 쿼리만 무효화
      });
    },
  });

  return { fetchData, createData, updateData, deleteData };
}
