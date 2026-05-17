// Redesigned with Ant Design — logic unchanged
import { useState } from "react";
import { UploadCloud, CheckCircle2, FileText, Download, Trash2, Star, BrainCircuit, X, Edit2, Network, Loader2 } from "lucide-react";
import { Card, Typography, Button, Input, Tag, Row, Col, Space } from "antd";
import { PulseOrb } from "@/components/ui/PulseOrb";

const { Title, Text } = Typography;

export default function UploadCV() {
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "scanning" | "mapping" | "profiling" | "complete">("idle");
  const [dragActive, setDragActive] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      startUploadSequence();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      startUploadSequence();
    }
  };

  const startUploadSequence = () => {
    setUploadState("uploading");
    
    // Simulate complex AI scanning process
    setTimeout(() => {
      setUploadState("scanning");
      setTimeout(() => {
        setUploadState("mapping");
        setTimeout(() => {
          setUploadState("profiling");
          setTimeout(() => {
            setUploadState("complete");
          }, 1000);
        }, 2000);
      }, 2000);
    }, 500); // instant receive
  };

  const [skills, setSkills] = useState([
    { name: "React", conf: "High" },
    { name: "JavaScript", conf: "High" },
    { name: "TypeScript", conf: "High" },
    { name: "Node.js", conf: "High" },
    { name: "MongoDB", conf: "Medium" },
    { name: "Python", conf: "Review" },
    { name: "Docker", conf: "Medium" },
    { name: "Git", conf: "High" },
  ]);

  const removeSkill = (name: string) => {
    setSkills(s => s.filter(x => x.name !== name));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl mx-auto pb-10">
      <div className="flex flex-col gap-2 text-center items-center">
        <div className="flex items-center gap-2">
           <BrainCircuit className="w-8 h-8 text-cyan-400" />
           <Title level={2} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Uplink</Title>
        </div>
        <Text type="secondary">Upload your CV and let the AI analyze your professional DNA.</Text>
      </div>

      {uploadState === "idle" && (
        <Card 
          bordered={false}
          className={`transition-all duration-300 border-2 border-dashed ${dragActive ? 'border-primary/50 bg-primary/10 shadow-[0_0_40px_rgba(249,115,22,0.2)] scale-[1.02]' : 'border-primary/30 hover:border-primary/60'}`}
          style={{ background: dragActive ? 'rgba(249, 115, 22, 0.1)' : 'var(--surface)', height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          bodyStyle={{ padding: 0, width: '100%', display: 'flex', justifyContent: 'center' }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center w-full">
            <div className={`p-4 rounded-full mb-4 transition-all duration-300 ${dragActive ? 'scale-125 bg-primary/20 shadow-[0_0_20px_rgba(249,115,22,0.3)]' : 'bg-foreground/5'}`} style={{ background: dragActive ? 'rgba(249, 115, 22, 0.2)' : 'rgba(255,255,255,0.05)' }}>
              <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-cyan-300 animate-pulse' : 'text-cyan-400'}`} />
            </div>
            <Title level={4} style={{ margin: 0, marginBottom: 8, color: 'var(--foreground)' }}>Drop your CV into the neural network</Title>
            <div className="flex items-center gap-4 text-muted-foreground w-full max-w-[240px] mb-4">
              <div className="h-px bg-foreground/10 flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <span className="text-xs uppercase tracking-widest font-semibold">or</span>
              <div className="h-px bg-foreground/10 flex-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
            
            <label htmlFor="cv-upload">
              <Button style={{ color: '#F97316', borderColor: 'rgba(249, 115, 22, 0.5)', background: 'transparent' }} onClick={() => document.getElementById('cv-upload')?.click()}>
                Select File
              </Button>
              <input id="cv-upload" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleChange} />
            </label>
            
            <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, fontWeight: 500 }}>PDF or DOCX • Max 10MB</Text>
          </div>
        </Card>
      )}

      {uploadState !== "idle" && uploadState !== "complete" && (
        <Card bordered={false} style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }} className="border-primary/40 animate-in fade-in duration-500 shadow-[0_0_30px_rgba(249,115,22,0.1)]">
          {uploadState === "scanning" && (
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent w-full h-[20%] animate-scan border-b border-cyan-500/50 z-0" />
          )}
          {uploadState === "mapping" && (
             <div className="absolute inset-0 flex items-center justify-center opacity-20 z-0 text-cyan-400 animate-pulse">
                <Network className="w-64 h-64" />
             </div>
          )}
          {uploadState === "profiling" && (
             <div className="absolute inset-0 bg-cyan-500/20 animate-flash z-0" />
          )}

          <div className="relative z-10 w-full max-w-[400px]">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-foreground/10" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
                <span className="text-white font-medium flex items-center gap-2"><FileText className="text-cyan-400 w-5 h-5"/> resume_ahmed.pdf</span>
                <span className="text-muted-foreground text-sm font-mono">2.4 MB</span>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">File received</span>
                   </div>
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      {uploadState === "scanning" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                      <span className={uploadState === "scanning" ? "text-cyan-300 font-medium animate-pulse" : "text-muted-foreground"}>Extracting neural data...</span>
                   </div>
                </div>

                {(uploadState === "mapping" || uploadState === "profiling") && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         {uploadState === "mapping" ? <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                         <span className={uploadState === "mapping" ? "text-cyan-300 font-medium animate-pulse" : "text-muted-foreground"}>Mapping skill constellation...</span>
                      </div>
                   </div>
                )}

                {uploadState === "profiling" && (
                   <div className="flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                      <div className="flex items-center gap-3">
                         <Loader2 className="w-5 h-5 text-cyan-400 shrink-0 animate-spin" />
                         <span className="text-cyan-300 font-medium animate-pulse">Profiling complete...</span>
                      </div>
                   </div>
                )}
             </div>

             {/* Circular Progress border ring simulating overall progress */}
             <svg className="absolute inset-x-0 inset-y-[-40px] w-full h-[calc(100%+80px)] -z-10 opacity-30 transform -rotate-90 pointer-events-none stroke-cyan-400" fill="none" strokeWidth="2">
                <rect width="100%" height="100%" rx="16" strokeDasharray="1000" strokeDashoffset={uploadState === 'scanning' ? 700 : uploadState === 'mapping' ? 300 : uploadState === 'profiling' ? 50 : 0} className="transition-all duration-1000" />
             </svg>
          </div>
        </Card>
      )}

      {uploadState === "complete" && (
        <Card bordered={false} style={{ background: 'var(--surface)', position: 'relative', overflow: 'hidden' }} bodyStyle={{ padding: 32 }} className="shadow-[0_0_30px_rgba(249,115,22,0.15)] animate-in slide-in-from-bottom-8 duration-700">
           {/* Animated gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center border border-primary/30" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                   <BrainCircuit className="w-5 h-5 text-cyan-400" />
                </div>
                <Title level={3} style={{ margin: 0, color: 'var(--foreground)' }}>Neural Profile Generated</Title>
              </div>
              <Text type="secondary" style={{ marginLeft: 52 }}>Successfully extracted from <Tag style={{ fontFamily: 'monospace', marginLeft: 4 }}>resume_ahmed.pdf</Tag></Text>
            </div>
            <div className="flex flex-col items-center text-center shrink-0">
               <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>CV Strength</Text>
               <PulseOrb score={72} size="lg" />
            </div>
          </div>

          <div className="space-y-8 p-6 rounded-xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.05)' }}>
            {/* Skills */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Detected Skills</Text>
                 <Button type="text" size="small" onClick={() => setIsEditing(!isEditing)} icon={<Edit2 className="w-3 h-3" />} style={{ color: isEditing ? '#F97316' : 'var(--muted-foreground)' }}>
                    {isEditing ? "Done" : "Edit"}
                 </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map(skill => (
                  <div key={skill.name} className="flex flex-col items-center gap-1 group relative">
                     <Tag 
                       closable={isEditing} 
                       onClose={() => removeSkill(skill.name)} 
                       color="cyan" 
                       style={{ padding: '4px 10px', fontSize: 14, margin: 0 }}
                     >
                       {skill.name}
                     </Tag>
                     {!isEditing && (
                        <span className={`text-[10px] font-semibold w-full text-center ${
                           skill.conf === 'High' ? 'text-emerald-400' : skill.conf === 'Medium' ? 'text-amber-400' : 'text-muted-foreground'
                        }`}>
                           {skill.conf === 'High' ? 'High ✓' : skill.conf === 'Medium' ? 'Medium ~' : 'Review ?'}
                        </span>
                     )}
                  </div>
                ))}
                {isEditing && (
                  <Input 
                    size="small" 
                    placeholder="+ Add Skill" 
                    style={{ width: 100, borderRadius: 16, borderStyle: 'dashed' }} 
                    onKeyDown={(e: any) => { if (e.key === 'Enter' && e.target.value) { setSkills([...skills, { name: e.target.value, conf: 'Review' }]); e.target.value = ''; } }} 
                  />
                )}
              </div>
            </div>

            <Row gutter={[32, 32]} style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Experience */}
              <Col xs={24} md={12}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 12 }}>Experience</Text>
                {isEditing ? (
                   <Input defaultValue="4 years" style={{ fontFamily: 'monospace' }} />
                ) : (
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, fontFamily: 'monospace', color: '#F97316' }}>4 years</div>
                )}
              </Col>
              {/* Education */}
              <Col xs={24} md={12}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 12 }}>Education</Text>
                {isEditing ? (
                   <Input defaultValue="BS Computer Science — INSAT" />
                ) : (
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, color: 'var(--foreground)' }}>BS Computer Science — INSAT</div>
                )}
              </Col>
            </Row>

            {/* Languages */}
            <div>
               <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, display: 'block', marginBottom: 12 }}>Languages</Text>
               <Space>
                  {["English", "French", "Arabic"].map(lang => (
                     <Tag key={lang} bordered={false}>{lang}</Tag>
                  ))}
               </Space>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t" style={{ borderTopColor: 'rgba(255,255,255,0.1)' }}>
            <Button type="primary" size="large" style={{ flex: 1, background: '#F97316', color: '#ffffff', fontWeight: 'bold' }}>
               Save Neural Profile
            </Button>
            <Button type="text" size="large" onClick={() => { setUploadState("idle"); setIsEditing(false); }} style={{ color: 'var(--muted-foreground)' }}>
               Scrap & Re-scan CV
            </Button>
          </div>
        </Card>
      )}

      {/* Archives Section */}
      <div className="mt-12">
        <Title level={4} style={{ color: 'var(--foreground)', marginBottom: 16 }}>Your Neural Archives</Title>
        <Card bordered={false} style={{ background: 'var(--surface)' }} bodyStyle={{ padding: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-foreground/5 transition-colors group" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                 <FileText className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="mb-2 md:mb-0">
                <Text strong style={{ color: 'var(--foreground)', display: 'block', marginBottom: 2 }}>resume_ahmed_2026.pdf</Text>
                <div className="flex items-center gap-2">
                   <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>2.4 MB</Text>
                   <span className="w-1 h-1 rounded-full bg-slate-600"/>
                   <Text type="secondary" style={{ fontSize: 12 }}>Mar 10, 2026</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
              <Tag color="success" icon={<Star className="w-3 h-3" style={{ marginRight: 4 }} />} bordered={false}>Active</Tag>
              <Space>
                 <Button type="text" icon={<Download className="w-4 h-4" />} style={{ color: 'var(--muted-foreground)' }} />
                 <Button type="text" icon={<Trash2 className="w-4 h-4" />} danger />
              </Space>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 hover:bg-foreground/5 transition-colors opacity-60">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-foreground/5 rounded-lg border border-foreground/10">
                 <FileText className="w-5 h-5 text-muted-foreground" />
               </div>
              <div className="mb-2 md:mb-0">
                <Text strong style={{ color: 'var(--muted-foreground)', display: 'block', marginBottom: 2 }}>dev_resume_old.docx</Text>
                <div className="flex items-center gap-2">
                   <Text type="secondary" style={{ fontSize: 12, fontFamily: 'monospace' }}>1.1 MB</Text>
                   <span className="w-1 h-1 rounded-full bg-slate-600"/>
                   <Text type="secondary" style={{ fontSize: 12 }}>Jan 15, 2026</Text>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0">
              <Button size="small" style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>Set Active ⭐</Button>
              <Space>
                 <Button type="text" icon={<Download className="w-4 h-4" />} style={{ color: 'var(--muted-foreground)' }} />
                 <Button type="text" icon={<Trash2 className="w-4 h-4" />} danger />
              </Space>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
