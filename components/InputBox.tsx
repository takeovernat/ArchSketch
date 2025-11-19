import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

interface InputBoxProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function InputBox({ value, onChange, onSubmit, loading }: InputBoxProps) {
  return (
    <div className="space-y-6">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. React frontend with Next.js and Tailwind, FastAPI backend, PostgreSQL database, Redis cache, authentication via Firebase Auth, deployed on AWS ECS with Terraform"
        className="min-h-48 text-lg"
      />
      <div className="flex justify-center">
        <Button onClick={onSubmit} disabled={loading || !value.trim()}>
          {loading ? "Generating..." : "Generate Diagram"}
        </Button>
      </div>
    </div>
  );
}