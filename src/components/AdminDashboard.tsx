import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Mail, CheckCircle, XCircle } from 'lucide-react';

interface Submission {
  id: number;
  title: string;
  author: string;
  email: string;
  description: string;
  genre: string;
  word_count: number;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  created_at: string;
}

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('book_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      setError('Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: number, status: Submission['status']) => {
    try {
      const { error } = await supabase
        .from('book_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchSubmissions(); // Refresh the list
    } catch (err) {
      console.error('Error updating submission:', err);
    }
  };

  const sendEmail = async (email: string, status: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: { email, status }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending email:', err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading submissions...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-cinzel text-center mb-8">Book Submissions Dashboard</h2>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-lg shadow-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/20">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Author</th>
                <th className="text-left py-3 px-4">Genre</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-b border-blue-500/10 hover:bg-blue-500/5">
                  <td className="py-3 px-4">{submission.title}</td>
                  <td className="py-3 px-4">{submission.author}</td>
                  <td className="py-3 px-4">{submission.genre}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      submission.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                      submission.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(submission.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateSubmissionStatus(submission.id, 'accepted');
                          sendEmail(submission.email, 'accepted');
                        }}
                        className="p-1 hover:bg-green-500/20 rounded-full transition-colors"
                        title="Accept"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      </button>
                      <button
                        onClick={() => {
                          updateSubmissionStatus(submission.id, 'rejected');
                          sendEmail(submission.email, 'rejected');
                        }}
                        className="p-1 hover:bg-red-500/20 rounded-full transition-colors"
                        title="Reject"
                      >
                        <XCircle className="w-5 h-5 text-red-400" />
                      </button>
                      <button
                        onClick={() => sendEmail(submission.email, 'reviewed')}
                        className="p-1 hover:bg-blue-500/20 rounded-full transition-colors"
                        title="Send Review Email"
                      >
                        <Mail className="w-5 h-5 text-blue-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 