import { CustomerSchema } from "@/interface";
import api from "@/protectedApi/Interceptor";
import { handleAxiosError } from "@/utils/error";
import { useEffect, useState } from "react";

const useCustomerIds = () => {
  const [customerIds, setCustomerIds] = useState<CustomerSchema[]>([]);

  const getIds = async () => {
    try {
      const response = await api.get("/customers/ids",);

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Customer ids fetched successfully");

      setCustomerIds(response.data.data || []);
    } catch (error) {
      console.log("Error while getting customer ids", error);
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    getIds();
  }, []);

  return customerIds;
};

export default useCustomerIds;
