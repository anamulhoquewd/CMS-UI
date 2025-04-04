import api from "@/protectedApi/Interceptor";
import { handleAxiosError } from "@/utils/error";
import { useEffect, useState } from "react";

const useCounts = () => {
  const [paymentsCount, setPaymentsCount] = useState<number>(0);

  const getPaymentsCount = async () => {
    try {
      const response = await api.get("/payments/count");

      if (!response.data.success) {
        throw new Error(response.data.error.message);
      }

      console.log("Payments counted");

      setPaymentsCount(response.data.data || 0);
    } catch (error) {
      handleAxiosError(error);
    }
  };

  useEffect(() => {
    getPaymentsCount();
  }, []);

  return { paymentsCount };
};

export default useCounts;
