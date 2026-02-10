"use client";

import { useState } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useApiKeyStore } from "@/store/api-key-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ApiKeyDialogProps {
  trigger?: React.ReactNode;
}

export function ApiKeyDialog({ trigger }: ApiKeyDialogProps) {
  const { falApiKey, setFalApiKey, clearFalApiKey } = useApiKeyStore();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showKey, setShowKey] = useState(false);

  function handleOpen(isOpen: boolean) {
    if (isOpen) {
      setInputValue(falApiKey ?? "");
      setShowKey(false);
    }
    setOpen(isOpen);
  }

  function handleSave() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setFalApiKey(trimmed);
    setOpen(false);
    toast.success("API key saved");
  }

  function handleRemove() {
    clearFalApiKey();
    setInputValue("");
    setOpen(false);
    toast.success("API key removed");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="icon">
            <Settings className="size-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>fal.ai API Key</DialogTitle>
          <DialogDescription>
            Enter your fal.ai API key to use Onset. Your key is stored
            locally in your browser and never sent to our servers.{" "}
            <a
              href="https://fal.ai/dashboard/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Get a key
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="fal-api-key">API Key</Label>
          <div className="relative">
            <Input
              id="fal-api-key"
              type={showKey ? "text" : "password"}
              placeholder="fal-..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter>
          {falApiKey && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove key
            </Button>
          )}
          <Button onClick={handleSave} disabled={!inputValue.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
