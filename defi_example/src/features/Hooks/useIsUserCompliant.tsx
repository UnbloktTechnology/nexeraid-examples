import { useQuery } from "@tanstack/react-query";

export const useIsUserCompliant = (props: { address?: string }) => {
  return useQuery({
    queryKey: ["defi", "isUserCompliant", props.address],
    queryFn: async () => {
      const result = await fetch(`/verify?address=${props.address}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const jsonData = await result.json();
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const isUserCompliant = jsonData?.result?.validate[0].is_valid ?? false;

        console.log("🆘 useIsUserCompliant.tsx:15 jsonData", {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          jsonData,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          isUserCompliant,
        });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return isUserCompliant;
      } catch (error) {
        console.error("🆘 useIsUserCompliant.tsx:21, error", error);
        console.log("🆘 useIsUserCompliant.tsx:22, jsonData", {
          jsonData: JSON.stringify(jsonData),
          result,
        });
        return false;
      }
    },
    enabled: !!props.address,
  });
};
