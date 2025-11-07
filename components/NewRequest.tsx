
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignatureRequests } from '../hooks/useSignatureRequests';
import { Signer, SignerStatus } from '../types';
// Fix: Added DocumentIcon to the import list.
import { PlusIcon, TrashIcon, SparklesIcon, PaperAirplaneIcon, DocumentIcon } from './IconComponents';
import { suggestMessage } from '../services/geminiService';

const NewRequest = () => {
  const navigate = useNavigate();
  const { addRequest } = useSignatureRequests();

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentDataUrl, setDocumentDataUrl] = useState<string>('');
  const [signers, setSigners] = useState<Partial<Signer>[]>([{ name: '', email: '' }]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentFile(file);
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setDocumentDataUrl(loadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignerChange = (index: number, field: 'name' | 'email', value: string) => {
    const newSigners = [...signers];
    newSigners[index] = { ...newSigners[index], [field]: value };
    setSigners(newSigners);
  };

  const addSigner = () => {
    setSigners([...signers, { name: '', email: '' }]);
  };

  const removeSigner = (index: number) => {
    if (signers.length > 1) {
      const newSigners = signers.filter((_, i) => i !== index);
      setSigners(newSigners);
    }
  };

  const handleSuggestMessage = async () => {
    if (!documentFile) {
        alert("Please upload a document first to generate a message.");
        return;
    }
    setIsSuggesting(true);
    try {
        const suggestion = await suggestMessage(documentFile.name);
        setMessage(suggestion);
    } catch (error) {
        console.error("Failed to suggest message:", error);
        alert("Could not generate a message at this time.");
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentFile || signers.some(s => !s.name || !s.email)) {
      alert('Please fill out all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    
    const finalSigners: Signer[] = signers.map((s, index) => ({
      id: `signer-${Date.now()}-${index}`,
      name: s.name!,
      email: s.email!,
      status: SignerStatus.Pending,
    }));

    addRequest({
      documentName: documentFile.name,
      documentDataUrl: documentDataUrl,
      signers: finalSigners,
      message,
    });
    
    // Simulate API call
    setTimeout(() => {
        setIsSubmitting(false);
        navigate('/');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">New Signature Request</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-3 dark:border-slate-700">1. Document</h2>
          <div>
            <label htmlFor="document-upload" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Upload Document (PDF recommended)</label>
            {!documentFile ? (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-300 dark:border-slate-600 px-6 py-10">
                    <div className="text-center">
                        <DocumentIcon className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="mt-4 flex text-sm leading-6 text-slate-600 dark:text-slate-400">
                        <label htmlFor="document-upload" className="relative cursor-pointer rounded-md bg-white dark:bg-slate-800 font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 dark:ring-offset-slate-800 hover:text-blue-500">
                            <span>Upload a file</span>
                            <input id="document-upload" name="document-upload" type="file" className="sr-only" onChange={handleFileChange} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-slate-500">PDF, DOCX, PNG, JPG up to 10MB</p>
                    </div>
                </div>
            ) : (
                <div className="mt-2 flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-md">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{documentFile.name}</p>
                    <button type="button" onClick={() => setDocumentFile(null)} className="text-sm text-red-600 hover:text-red-800 font-semibold">Remove</button>
                </div>
            )}
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 border-b pb-3 dark:border-slate-700">2. Signers</h2>
          <div className="space-y-4">
            {signers.map((signer, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                <span className="text-slate-500 dark:text-slate-400 font-semibold">{index + 1}</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={signer.name || ''}
                  onChange={e => handleSignerChange(index, 'name', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={signer.email || ''}
                  onChange={e => handleSignerChange(index, 'email', e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  required
                />
                <button type="button" onClick={() => removeSigner(index)} disabled={signers.length <= 1} className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 disabled:hover:text-slate-400">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addSigner} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">
            <PlusIcon className="w-5 h-5" /> Add Another Signer
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-slate-700">
            <h2 className="text-xl font-semibold">3. Message</h2>
            <button
                type="button"
                onClick={handleSuggestMessage}
                disabled={isSuggesting || !documentFile}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900/50 rounded-md hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <SparklesIcon className="w-4 h-4" />
                {isSuggesting ? 'Generating...' : 'Suggest with AI'}
            </button>
          </div>
          <textarea
            rows={4}
            placeholder="Optional message to the signers..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-3 text-slate-900 dark:text-white dark:bg-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-wait"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
            {isSubmitting ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequest;
