
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Video, 
  FileText, 
  Clock, 
  GripVertical, 
  Trash2, 
  Edit2, 
  UploadCloud,
  X,
  File as FileIcon,
  Layout,
  Settings
} from 'lucide-react';

// UI Components
const TabButton = ({ active, onClick, icon: Icon, children }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
      active 
        ? 'border-[#C39766] text-[#C39766]' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {Icon && <Icon size={18} />}
    {children}
  </button>
);

const InputGroup = ({ label, children, helper }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
    {helper && <p className="text-xs text-gray-500 mt-1">{helper}</p>}
  </div>
);

const TrainerCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('curriculum');
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // Form States
  const [lessonForm, setLessonForm] = useState({
    videoType: 'url',
    duration: 0,
    isPublished: true,
    materials: [],
    existingMaterials: []
  });
  
  const [courseForm, setCourseForm] = useState({});

  const fetchData = async () => {
    if (!courseId) return;
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        api.getCourseById(courseId),
        api.getLessonsByCourseId(courseId)
      ]);
      setCourse(courseRes.data);
      setCourseForm(courseRes.data);
      setLessons(lessonsRes.data);
    } catch (error) {
      console.error(error);
      // In real app, handle error (toast or redirect)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    try {
      const { data } = await api.updateCourse(course._id, courseForm);
      setCourse(data);
      alert('Course details updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const openLessonModal = (lesson) => {
    if (lesson) {
      setEditingLessonId(lesson._id);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoType: lesson.videoUrl ? 'url' : 'file',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        existingMaterials: lesson.materials || [],
        materials: []
      });
    } else {
      setEditingLessonId(null);
      setLessonForm({
        title: '',
        description: '',
        content: '',
        videoType: 'url',
        videoUrl: '',
        duration: 0,
        isPublished: true,
        materials: [],
        existingMaterials: []
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!courseId || !lessonForm.title) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        courseId,
        title: lessonForm.title,
        description: lessonForm.description || '',
        content: lessonForm.content || '',
        duration: Number(lessonForm.duration) || 0,
        videoType: lessonForm.videoType || 'url',
        videoUrl: lessonForm.videoUrl,
        videoFile: lessonForm.videoFile,
        materials: lessonForm.materials, // New files to upload
        isPublished: lessonForm.isPublished
      };

      if (editingLessonId) {
        await api.updateLesson(editingLessonId, payload);
      } else {
        await api.createLesson(payload);
      }
      
      setIsLessonModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if(!window.confirm("Are you sure you want to delete this lesson? This cannot be undone.")) return;
    try {
      await api.deleteLesson(id);
      setLessons(lessons.filter(l => l._id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C39766]"></div></div>;
  }

  if (!course) return <div>Course not found</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/trainer/courses')} className="p-2 hover:bg-white bg-white border border-gray-200 rounded-full text-gray-500 shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${course.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {course.status.toUpperCase()}
              </span>
              <span>•</span>
              <span>{lessons.length} Lessons</span>
              <span>•</span>
              <span>{course.duration} Hours Total</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
            Preview Course
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 flex gap-2">
        <TabButton 
          active={activeTab === 'curriculum'} 
          onClick={() => setActiveTab('curriculum')}
          icon={Layout}
        >
          Curriculum
        </TabButton>
        <TabButton 
          active={activeTab === 'settings'} 
          onClick={() => setActiveTab('settings')}
          icon={Settings}
        >
          Course Info & Settings
        </TabButton>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-gray-200 min-h-[600px] p-6">
        
        {/* CURRICULUM TAB */}
        {activeTab === 'curriculum' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-gray-500">Organize and manage your lessons.</p>
              </div>
              <button 
                onClick={() => openLessonModal()}
                className="bg-[#C39766] hover:bg-[#A67A52] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus size={18} />
                Add Lesson
              </button>
            </div>

            {lessons.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-gray-400" size={32} />
                </div>
                <h4 className="text-gray-900 font-medium mb-1">No lessons yet</h4>
                <p className="text-gray-500 mb-4">Start building your curriculum by adding a lesson.</p>
                <button onClick={() => openLessonModal()} className="text-[#C39766] font-medium hover:underline">
                  Create your first lesson
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div key={lesson._id} className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow flex items-center gap-4">
                    <div className="text-gray-400 cursor-grab active:cursor-grabbing p-1 hover:text-gray-600">
                      <GripVertical size={20} />
                    </div>
                    
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      {lesson.videoUrl || lesson.videoFile ? <Video size={20} /> : <FileText size={20} />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-medium text-gray-900 truncate">{lesson.title}</h4>
                        {!lesson.isPublished && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded font-medium">Draft</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={14} /> {lesson.duration} min</span>
                        {lesson.materials && lesson.materials.length > 0 && (
                          <span className="flex items-center gap-1"><FileIcon size={14} /> {lesson.materials.length} files</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openLessonModal(lesson)}
                        className="p-2 text-gray-400 hover:text-[#C39766] hover:bg-[#C39766]/10 rounded-lg transition-colors"
                        title="Edit Lesson"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Lesson"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Settings</h3>
            <form onSubmit={handleUpdateCourse} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <InputGroup label="Course Title">
                    <input 
                      type="text" 
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] focus:border-transparent outline-none"
                      value={courseForm.title || ''}
                      onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                    />
                  </InputGroup>
                </div>
                
                <InputGroup label="Category">
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none bg-white"
                    value={courseForm.category || ''}
                    onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                  >
                    <option value="Digital Tools">Digital Tools</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Financial Literacy">Financial Literacy</option>
                    <option value="Business Management">Business Management</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Other">Other</option>
                  </select>
                </InputGroup>

                <InputGroup label="Level">
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none bg-white"
                    value={courseForm.level || ''}
                    onChange={e => setCourseForm({...courseForm, level: e.target.value})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </InputGroup>

                <InputGroup label="Price (USD)">
                   <div className="relative">
                      <span className="absolute left-3 top-2 text-gray-500">$</span>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="w-full pl-7 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none"
                        value={courseForm.price || 0}
                        onChange={e => setCourseForm({...courseForm, price: parseFloat(e.target.value), isFree: parseFloat(e.target.value) === 0})}
                      />
                   </div>
                </InputGroup>

                <InputGroup label="Duration (Hours)">
                   <input 
                      type="number" 
                      min="0"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none"
                      value={courseForm.duration || 0}
                      onChange={e => setCourseForm({...courseForm, duration: parseFloat(e.target.value)})}
                    />
                </InputGroup>

                <div className="col-span-2">
                  <InputGroup label="Description">
                    <textarea 
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none"
                      value={courseForm.description || ''}
                      onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                    />
                  </InputGroup>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => fetchData()} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Reset</button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="px-6 py-2 bg-[#C39766] hover:bg-[#A67A52] text-white rounded-lg font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                  {!saving && <Save size={18} />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* LESSON MODAL */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingLessonId ? 'Edit Lesson' : 'Create New Lesson'}
              </h2>
              <button onClick={() => setIsLessonModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <InputGroup label="Lesson Title">
                  <input 
                    type="text" 
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none"
                    placeholder="e.g., Introduction to the Course"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                  />
                </InputGroup>

                <div className="grid grid-cols-2 gap-6">
                  <InputGroup label="Video Source">
                    <div className="flex rounded-lg border border-gray-300 p-1 bg-gray-50">
                      <button 
                        type="button"
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${lessonForm.videoType === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setLessonForm({...lessonForm, videoType: 'url'})}
                      >
                        Video URL
                      </button>
                      <button 
                        type="button"
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${lessonForm.videoType === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setLessonForm({...lessonForm, videoType: 'file'})}
                      >
                        Upload Video
                      </button>
                    </div>
                  </InputGroup>

                  <InputGroup label="Duration (minutes)">
                     <input 
                        type="number" 
                        min="0"
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none"
                        value={lessonForm.duration}
                        onChange={e => setLessonForm({...lessonForm, duration: parseInt(e.target.value) || 0})}
                      />
                  </InputGroup>
                </div>

                {lessonForm.videoType === 'url' ? (
                  <InputGroup label="Video URL" helper="Paste a YouTube, Vimeo, or other video link">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#C39766]">
                      <div className="pl-3 text-gray-400"><Video size={20} /></div>
                      <input 
                        type="url" 
                        className="w-full p-2.5 outline-none border-none"
                        placeholder="https://youtube.com/..."
                        value={lessonForm.videoUrl}
                        onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                      />
                    </div>
                  </InputGroup>
                ) : (
                  <InputGroup label="Upload Video File" helper="Supported formats: MP4, WebM (Max 500MB)">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                      <input 
                        type="file" 
                        accept="video/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            setLessonForm({...lessonForm, videoFile: e.target.files[0]});
                          }
                        }}
                      />
                      <UploadCloud className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm font-medium text-gray-700">
                        {lessonForm.videoFile ? lessonForm.videoFile.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {lessonForm.videoFile ? `${(lessonForm.videoFile.size / (1024*1024)).toFixed(2)} MB` : 'MP4 or WebM'}
                      </p>
                    </div>
                  </InputGroup>
                )}

                <InputGroup label="Description & Content">
                  <textarea 
                    rows={6}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C39766] outline-none resize-y"
                    placeholder="What will students learn in this lesson?"
                    value={lessonForm.description || ''}
                    onChange={e => setLessonForm({...lessonForm, description: e.target.value})}
                  />
                </InputGroup>

                <InputGroup label="Downloadable Materials">
                  <div className="space-y-3">
                    {/* List existing materials */}
                    {lessonForm.existingMaterials.map((mat, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileIcon size={18} className="text-[#C39766] shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{mat.originalName}</span>
                          <span className="text-xs text-gray-400">({(mat.fileSize / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button 
                          onClick={() => {
                             setLessonForm({
                               ...lessonForm, 
                               existingMaterials: lessonForm.existingMaterials.filter((_, i) => i !== idx)
                             });
                          }}
                          className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    
                    {/* Upload new */}
                    <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700">
                       <Plus size={16} />
                       Add Material (PDF, Doc, Zip)
                       <input 
                         type="file" 
                         multiple 
                         className="hidden"
                         onChange={e => {
                           if (e.target.files && e.target.files.length > 0) {
                             const newFiles = Array.from(e.target.files);
                             setLessonForm({
                               ...lessonForm,
                               materials: [...lessonForm.materials, ...newFiles]
                             });
                           }
                         }}
                       />
                    </label>
                    
                    {lessonForm.materials.map((file, idx) => (
                       <div key={`new-${idx}`} className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <UploadCloud size={18} className="text-blue-500 shrink-0" />
                          <span className="text-sm text-blue-900 truncate">{file.name}</span>
                          <span className="text-xs text-blue-400">(New)</span>
                        </div>
                        <button 
                           onClick={() => {
                             const newMats = [...lessonForm.materials];
                             newMats.splice(idx, 1);
                             setLessonForm({...lessonForm, materials: newMats});
                           }}
                           className="text-red-500 hover:bg-red-50 p-1 rounded"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </InputGroup>

                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox"
                    id="isPublished"
                    className="w-4 h-4 text-[#C39766] focus:ring-[#C39766] border-gray-300 rounded"
                    checked={lessonForm.isPublished}
                    onChange={e => setLessonForm({...lessonForm, isPublished: e.target.checked})}
                  />
                  <label htmlFor="isPublished" className="text-sm text-gray-700 font-medium">Publish this lesson immediately</label>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setIsLessonModalOpen(false)}
                className="px-5 py-2.5 text-gray-600 font-medium hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveLesson}
                disabled={saving}
                className="px-6 py-2.5 bg-[#C39766] hover:bg-[#A67A52] text-white rounded-lg font-medium shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? (
                  <>Saving...</>
                ) : (
                  <>{editingLessonId ? 'Update Lesson' : 'Create Lesson'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerCourseContent;
