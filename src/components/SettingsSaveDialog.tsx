import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Database, Shield } from "lucide-react";

interface SettingsSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  settingsCount: number;
}

export const SettingsSaveDialog = ({
  open,
  onOpenChange,
  onConfirm,
  settingsCount,
}: SettingsSaveDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <AlertDialogTitle className="text-2xl">
              Save Settings to Database?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-4 text-base">
            <p className="text-foreground font-medium">
              You are about to save {settingsCount} setting{settingsCount !== 1 ? 's' : ''} to the Supabase database.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Database className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900">What will happen:</p>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1 list-disc list-inside">
                    <li>Settings will be permanently stored in Supabase</li>
                    <li>Changes will be immediately visible across your website</li>
                    <li>Previous values will be overwritten</li>
                    <li>All changes are logged with timestamps</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900">⚠️ Important Recommendations:</p>
                  <ul className="text-sm text-orange-800 mt-1 space-y-1 list-disc list-inside">
                    <li><strong>Backup your database</strong> before making changes</li>
                    <li>Test changes in a development environment first</li>
                    <li>Document any custom configurations</li>
                    <li>Verify email settings before saving SMTP credentials</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>💡 Tip:</strong> You can create a database backup from the{" "}
                <span className="font-mono bg-gray-200 px-1 rounded">Advanced</span> tab
                or directly in your Supabase dashboard.
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              By clicking "Save Settings", you confirm that you understand these changes
              will be written to the production database.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-primary hover:bg-primary/90"
          >
            Yes, Save Settings
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
