import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, X, FileText, Image, Link, Globe } from 'lucide-react';
import { getToolById } from '../../lib/tools.config';
import { useToolSubmit } from '../../hooks/useToolSubmit';
import Paywall from '../../components/Paywall';
import ResultCard from '../../components/ResultCard';
import Loader from '../../components/Loader';

const MAX_FILE_SIZE_MB = 10;

interface AttachedFile {
  name: string;
  type: string;
  base64: string;
  preview?: string;
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(u.protocol);
  } catch {
    return false;
  }
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const tool = getToolById(toolId || '');
  const { submit, loading, error, result, reset } = useToolSubmit();
  const [input, setInput] = useState('');
  const [fullResult, setFullResult] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isUrlMode = tool?.inputType === 'url';
  const isDocMode = tool?.id === 'lexdraft';

  const newAnalysisLabel = isUrlMode
    ? 'Scan Another Site'
    : isDocMode
    ? 'Draft Another Document'
    : 'New Analysis';

  const resultLabel = isDocMode ? 'Generated Document' : 'Full Analysis';
  const lockedLabel = isDocMode ? 'Full document locked' : 'Full analysis locked';

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.BackButton.show();
      const goBack = () => navigate(-1);
      tg.BackButton.onClick(goBack);
      return () => {
        tg.BackButton.offClick(goBack);
        tg.BackButton.hide();
      };
    }
  }, [navigate]);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Tool not found</p>
        <button onClick={() => navigate('/')} className="text-emerald-600 text-sm mt-2">
          Back to tools
        </button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Max ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setFileError('Only JPG, PNG, WEBP, GIF, or PDF files are supported.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const base64 = result.split(',')[1];
      const preview = file.type.startsWith('image/') ? result : undefined;
      setAttachedFile({ name: file.name, type: file.type, base64, preview });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isUrlMode) {
      if (!input.trim() || !isValidUrl(input.trim())) return;
    } else {
      if (!input.trim() && !attachedFile) return;
    }

    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('medium');
    submit({
      toolId: tool.id,
      input: input.trim() || '(See attached document)',
      fileData: attachedFile?.base64,
      fileType: attachedFile?.type,
      fileName: attachedFile?.name,
    });
  };

  const handleNewAnalysis = () => {
    setInput('');
    setFullResult(null);
    setAttachedFile(null);
    setFileError(null);
    reset();
  };

  const applyTemplate = (text: string) => {
    setInput(text);
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
  };

  const canSubmit = isUrlMode
    ? input.trim().length > 0 && isValidUrl(input.trim())
    : input.trim().length > 0 || attachedFile !== null;

  const domain = isUrlMode && input ? extractDomain(input) : '';

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-gray-500 mb-4 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className={`${tool.color} rounded-2xl p-5 mb-4`}>
        <h2 className="text-lg font-bold text-gray-900">{tool.name}</h2>
        <p className="text-xs text-gray-500 mt-1">{tool.tagline}</p>
        <p className="text-sm text-gray-600 mt-2">{tool.description}</p>
      </div>

      {fullResult ? (
        <div>
          <ResultCard toolName={tool.name} fullResult={fullResult} resultLabel={resultLabel} />
          <button
            onClick={handleNewAnalysis}
            className="w-full mt-4 py-3 px-6 rounded-2xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {newAnalysisLabel}
          </button>
        </div>
      ) : result ? (
        <Paywall
          teaser={result.teaser}
          sessionToken={result.sessionToken}
          toolName={tool.name}
          onUnlocked={setFullResult}
          lockedLabel={lockedLabel}
        />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Quick Templates */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              {isUrlMode ? 'Try these' : 'Quick templates'}
            </p>
            <div className="flex flex-wrap gap-2">
              {tool.templates.map((tpl) => (
                <button
                  key={tpl.label}
                  type="button"
                  onClick={() => applyTemplate(tpl.text)}
                  className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* URL Input (ToScan only) */}
          {isUrlMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tool.inputLabel}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  {domain && isValidUrl(input) ? (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=16`}
                      alt=""
                      className="w-4 h-4 rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <Globe className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tool.inputPlaceholder}
                  className="w-full rounded-xl border border-gray-200 pl-9 pr-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="url"
                />
              </div>
              {domain && isValidUrl(input) && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Link className="w-3 h-3 text-indigo-400" />
                  <p className="text-xs text-indigo-600 font-medium">{domain}</p>
                  <span className="text-xs text-gray-400">— we'll fetch the Terms of Service automatically</span>
                </div>
              )}
              {input && !isValidUrl(input) && (
                <p className="text-xs text-red-400 mt-1">Enter a valid URL (e.g. https://airbnb.com)</p>
              )}
            </div>
          ) : (
            <>
              {/* File Upload */}
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Attach document or photo
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {attachedFile ? (
                  <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
                    {attachedFile.preview ? (
                      <img src={attachedFile.preview} alt="preview" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-red-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{attachedFile.name}</p>
                      <p className="text-xs text-gray-400">
                        {attachedFile.type.startsWith('image/') ? 'Image' : 'PDF'} · ready to analyze
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedFile(null)}
                      className="p-1 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Paperclip className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700">Upload file</p>
                      <p className="text-xs text-gray-400">JPG, PNG, PDF · max 10MB</p>
                    </div>
                    <Image className="w-4 h-4 text-gray-300 ml-auto" />
                  </button>
                )}

                {fileError && <p className="text-xs text-red-500 mt-1">{fileError}</p>}
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tool.inputLabel}
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={tool.inputPlaceholder}
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>
            </>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}

          {loading ? (
            <Loader text={isUrlMode ? 'Fetching & analyzing terms…' : isDocMode ? 'Drafting your document…' : 'AI is analyzing your case...'} />
          ) : (
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-2xl transition-colors text-sm ${
                isUrlMode
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-[#1D4035] hover:bg-[#164030]'
              }`}
            >
              {isUrlMode ? 'Scan Terms of Service' : isDocMode ? 'Generate Document' : 'Analyze'}
            </button>
          )}
        </form>
      )}
    </div>
  );
}
