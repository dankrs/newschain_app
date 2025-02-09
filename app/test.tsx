import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { supabase } from "@/services/supabase";

export default function TestScreen() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from("topics")
          .select("*")
          .limit(1);

        if (error) {
          setStatus("error");
          setMessage(error.message);
          return;
        }

        setStatus("success");
        setMessage(`Connected successfully! Found ${data.length} topics.`);
      } catch (err) {
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Unknown error occurred",
        );
      }
    }

    testConnection();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Supabase Connection Test</Text>
      <Text
        variant="bodyLarge"
        style={{ marginTop: 20, color: status === "error" ? "red" : "green" }}
      >
        Status: {status}
      </Text>
      <Text style={{ marginTop: 10 }}>{message}</Text>
    </View>
  );
}
