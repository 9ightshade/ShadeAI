
interface MessageType {
    id: number;
    text: string;
    timestamp: string;
    detectedLanguage: string | null;
    summary: string | null;
    translation: string | null;
}