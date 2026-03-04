import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Settings2, BarChart3, Cpu, Download, ArrowRight, Sparkles, Zap, FlaskConical, BrainCircuit, Database, Layers, ChevronRight } from 'lucide-react'

const STORY = [
  { eyebrow: 'hello, data scientist.', headline: 'You have a CSV file.', body: "It's just sitting there. Rows, columns, numbers staring back at you.", cta: 'Yeah. Now what?', color: '#00d4ff', glyph: '⌗' },
  { eyebrow: 'look closer.', headline: 'Those numbers are not random.', body: "Inside that spreadsheet lives a pattern. An answer to a question you haven't asked yet.", cta: "But I can't see it.", color: '#9b6dff', glyph: '◈' },
  { eyebrow: "that's the problem.", headline: 'Data science takes months to learn.', body: "AutoML. Feature engineering. Hyperparameter tuning. It's a full-time job.", cta: "I don't have months.", color: '#10e87e', glyph: '⟁' },
  { eyebrow: 'we know.', headline: 'You have minutes.', body: 'Upload your CSV. We clean it, profile it, engineer features, train dozens of models and hand you the winner.', cta: 'In... actual minutes?', color: '#f5a623', glyph: '⬡' },
  { eyebrow: 'actual minutes.', headline: 'This is Data Alchemy.', body: 'Raw data goes in. Trained intelligence comes out. No PhD required.', cta: 'Begin the transformation →', color: '#00d4ff', glyph: '⚗', isFinal: true },
]

const PIPELINE = [
  { icon: Upload, label: 'Upload', sub: 'CSV or Excel', color: '#00d4ff', step: '01' },
  { icon: Settings2, label: 'Operate', sub: 'Clean & shape', color: '#9b6dff', step: '02' },
  { icon: BarChart3, label: 'Explore', sub: 'Profile & visualise', color: '#10e87e', step: '03' },
  { icon: Cpu, label: 'Forge', sub: 'AutoGluon trains models', color: '#f5a623', step: '04' },
  { icon: Download, label: 'Vault', sub: 'Download your model', color: '#ff6b9d', step: '05' },
]

const FEATURES = [
  { icon: BrainCircuit, label: 'AutoGluon', desc: '50+ models, one winner', color: '#00d4ff' },
  { icon: Layers, label: 'AutoFeat', desc: 'AI-crafted feature engineering', color: '#9b6dff' },
  { icon: BarChart3, label: 'YData Profiling', desc: 'Deep dataset intelligence', color: '#10e87e' },
  { icon: Database, label: 'D-Tale', desc: 'Interactive data explorer', color: '#f5a623' },
]


function AlchemyParticles({ color }) {
  const canvasRef = useRef(null), rafRef = useRef(null), ptsRef = useRef([]), colorRef = useRef(color)
  useEffect(() => { colorRef.current = color }, [color])
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const resize = () => {
      cv.width = cv.offsetWidth; cv.height = cv.offsetHeight
      ptsRef.current = Array.from({ length: 60 }, () => ({ x: Math.random()*cv.width, y: Math.random()*cv.height, r: Math.random()*2+0.4, vx: (Math.random()-.5)*.4, vy: (Math.random()-.5)*.4, o: Math.random()*.55+.1 }))
    }
    resize(); window.addEventListener('resize', resize)
    const draw = () => {
      const W=cv.width,H=cv.height,c=colorRef.current; ctx.clearRect(0,0,W,H)
      ptsRef.current.forEach(p => {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=W; if(p.x>W)p.x=0; if(p.y<0)p.y=H; if(p.y>H)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=c+Math.round(p.o*255).toString(16).padStart(2,'0'); ctx.fill()
      })
      const pts=ptsRef.current
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y)
        if(d<100){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=c+Math.round((1-d/100)*.15*255).toString(16).padStart(2,'0');ctx.lineWidth=.6;ctx.stroke()}
      }
      rafRef.current=requestAnimationFrame(draw)
    }
    draw()
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener('resize',resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} />
}

function Ring({ size, dur, rev, color }) {
  return (
    <div style={{ position:'absolute',width:size,height:size,borderRadius:'50%',border:`2px solid ${color}`,top:'50%',left:'50%',transform:'translate(-50%,-50%)',pointerEvents:'none' }}>
      <motion.div animate={{ rotate:rev?-360:360 }} transition={{ duration:dur,repeat:Infinity,ease:'linear' }} style={{ width:'100%',height:'100%',borderRadius:'50%',position:'relative' }}>
        <div style={{ position:'absolute',top:-4,left:'50%',transform:'translateX(-50%)',width:7,height:7,borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}` }} />
      </motion.div>
    </div>
  )
}

function Typewriter({ text, color }) {
  const [shown,setShown]=useState('')
  useEffect(()=>{
    setShown(''); let i=0
    const iv=setInterval(()=>{ i++; setShown(text.slice(0,i)); if(i>=text.length)clearInterval(iv) },22)
    return ()=>clearInterval(iv)
  },[text])
  return (
    <span style={{ color,fontFamily:'var(--font-mono)',fontSize:11,fontWeight:600,letterSpacing:'0.12em',textTransform:'uppercase',transition:'color 0.8s' }}>
      {shown}<motion.span animate={{ opacity:[1,0] }} transition={{ duration:.55,repeat:Infinity }}>_</motion.span>
    </span>
  )
}

function IntroOverlay({ onDone }) {
  const [step,setStep]=useState(0), [exiting,setExit]=useState(false)
  const cur=STORY[step]
  const advance=()=>{ if(cur.isFinal){setExit(true);setTimeout(onDone,900);return}; setStep(s=>s+1) }
  return (
    <motion.div initial={{opacity:1}} animate={{opacity:exiting?0:1}} transition={{duration:exiting?.9:.01}}
      style={{position:'fixed',inset:0,zIndex:999,background:'#070d1a',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:24,overflow:'hidden'}}>
      <AlchemyParticles color={cur.color}/>
      <div style={{position:'absolute',inset:0,zIndex:1,pointerEvents:'none',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)'}}/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity:.04,backgroundImage:'radial-gradient(circle,#dce8ff 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
      <motion.div animate={{opacity:[.4,.75,.4]}} transition={{duration:4.5,repeat:Infinity,ease:'easeInOut'}} style={{position:'absolute',inset:0,pointerEvents:'none',background:`radial-gradient(ellipse 65% 65% at 50% 50%, ${cur.color}09 0%, transparent 70%)`,transition:'background .8s ease'}}/>
      <div style={{position:'absolute',top:24,left:32,zIndex:2,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-3)'}}>DATA-ALCHEMY // v3.1</div>
      <div style={{position:'absolute',top:24,right:32,zIndex:2,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-3)'}}>{String(step+1).padStart(2,'0')} / {String(STORY.length).padStart(2,'0')}</div>
      <div style={{position:'relative',zIndex:2,display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:32,maxWidth:640,width:'100%'}}>
        <div style={{position:'relative',width:160,height:160,flexShrink:0}}>
          <Ring size={210} dur={28} rev={false} color={cur.color}/>
          <Ring size={320} dur={44} rev={true} color={cur.color}/>
          <Ring size={430} dur={66} rev={false} color={cur.color}/>
          <motion.div animate={{scale:[1,1.2,1],opacity:[.3,.6,.3]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}} style={{position:'absolute',inset:-30,borderRadius:'50%',background:`radial-gradient(circle,${cur.color}40 0%,transparent 70%)`,transition:'background .8s ease'}}/>
          <motion.div animate={{boxShadow:[`0 0 0px ${cur.color}00,inset 0 0 20px ${cur.color}33`,`0 0 60px ${cur.color}44,inset 0 0 40px ${cur.color}55`,`0 0 0px ${cur.color}00,inset 0 0 20px ${cur.color}33`]}} transition={{duration:3.5,repeat:Infinity,ease:'easeInOut'}}
            style={{position:'absolute',inset:0,borderRadius:'50%',border:`1.5px solid ${cur.color}55`,background:`radial-gradient(circle at 35% 35%,${cur.color}18 0%,#070d1a 65%)`,display:'flex',alignItems:'center',justifyContent:'center',transition:'border-color .8s,background .8s'}}>
            <AnimatePresence mode="wait">
              <motion.span key={cur.glyph} initial={{opacity:0,scale:.3,filter:'blur(14px)'}} animate={{opacity:1,scale:1,filter:'blur(0px)'}} exit={{opacity:0,scale:1.8,filter:'blur(14px)'}} transition={{duration:.55,ease:[.22,1,.36,1]}}
                style={{fontSize:64,lineHeight:1,color:cur.color,textShadow:`0 0 30px ${cur.color},0 0 60px ${cur.color}66`,fontFamily:'serif',userSelect:'none',transition:'color .8s'}}>{cur.glyph}</motion.span>
            </AnimatePresence>
          </motion.div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{opacity:0,y:32,filter:'blur(10px)'}} animate={{opacity:1,y:0,filter:'blur(0px)'}} exit={{opacity:0,y:-24,filter:'blur(10px)'}} transition={{duration:.48,ease:[.22,1,.36,1]}}
            style={{display:'flex',flexDirection:'column',alignItems:'center',gap:16}}>
            <Typewriter text={cur.eyebrow} color={cur.color}/>
            <motion.h1 initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:.16,duration:.5}}
              style={{fontFamily:'var(--font-display)',fontSize:'clamp(28px,5vw,52px)',fontWeight:800,lineHeight:1.1,letterSpacing:'-.035em',color:'var(--text)',margin:0}}>{cur.headline}</motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.3,duration:.6}}
              style={{fontSize:16,color:'var(--text-2)',lineHeight:1.78,maxWidth:460,margin:0}}>{cur.body}</motion.p>
          </motion.div>
        </AnimatePresence>
        <div style={{display:'flex',gap:8}}>
          {STORY.map((s,i)=>(<motion.div key={i} animate={{width:i===step?32:8,background:i<step?s.color+'55':i===step?cur.color:'#1e2f50'}} transition={{duration:.4,ease:[.22,1,.36,1]}} style={{height:4,borderRadius:2}}/>))}
        </div>
        <motion.button key={'cta-'+step} initial={{opacity:0,y:20,scale:.88}} animate={{opacity:1,y:0,scale:1}} transition={{delay:.44,type:'spring',stiffness:280,damping:22}}
          whileHover={{scale:1.06,boxShadow:`0 0 50px ${cur.color}55,0 0 100px ${cur.color}1a`}} whileTap={{scale:.96}} onClick={advance}
          style={{padding:cur.isFinal?'18px 56px':'14px 42px',borderRadius:cur.isFinal?16:12,border:`1.5px solid ${cur.color}`,background:cur.isFinal?`linear-gradient(135deg,${cur.color}30,${cur.color}16)`:`${cur.color}16`,color:cur.color,fontFamily:'var(--font-display)',fontSize:cur.isFinal?18:15,fontWeight:800,letterSpacing:'-.02em',cursor:'pointer',position:'relative',overflow:'hidden',transition:'all .35s',display:'flex',alignItems:'center',gap:12}}>
          <motion.div animate={{x:['-130%','230%']}} transition={{duration:2.8,repeat:Infinity,ease:'easeInOut',repeatDelay:.8}} style={{position:'absolute',inset:0,background:`linear-gradient(90deg,transparent,${cur.color}22,transparent)`,pointerEvents:'none'}}/>
          {cur.cta}
          {!cur.isFinal&&<motion.span animate={{x:[0,5,0]}} transition={{duration:1.1,repeat:Infinity}} style={{display:'inline-block',fontSize:18}}>→</motion.span>}
          {cur.isFinal&&<Zap size={18}/>}
        </motion.button>
      </div>
      <motion.div initial={{opacity:0}} animate={{opacity:.35}} transition={{delay:1.4}}
        style={{position:'absolute',bottom:28,zIndex:2,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-3)',letterSpacing:'.15em',textTransform:'uppercase'}}>
        raw data → trained intelligence
      </motion.div>
    </motion.div>
  )
}

const stagger={hidden:{},show:{transition:{staggerChildren:.08}}}
const fadeUp={hidden:{opacity:0,y:28,filter:'blur(6px)'},show:{opacity:1,y:0,filter:'blur(0px)',transition:{duration:.55,ease:[.22,1,.36,1]}}}

function PipelineStep({icon:Icon,label,sub,color,step:num,index,total}){
  return(
    <motion.div variants={fadeUp} style={{display:'flex',alignItems:'center',flex:1,minWidth:0}}>
      <motion.div whileHover={{y:-6,boxShadow:`0 18px 44px ${color}22`}} transition={{type:'spring',stiffness:300,damping:22}}
        style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:10,padding:'22px 12px',background:'var(--surface)',borderRadius:16,border:`1px solid ${color}33`,position:'relative',overflow:'hidden',cursor:'default'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${color},transparent)`}}/>
        <div style={{width:44,height:44,borderRadius:12,background:`${color}16`,border:`1px solid ${color}44`,display:'flex',alignItems:'center',justifyContent:'center',color}}><Icon size={20} strokeWidth={1.8}/></div>
        <div style={{textAlign:'center'}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:3}}>{label}</div>
          <div style={{fontSize:11,color:'var(--text-3)'}}>{sub}</div>
        </div>
        <div style={{position:'absolute',bottom:8,right:10,fontFamily:'var(--font-mono)',fontSize:9,color:`${color}66`,fontWeight:700}}>{num}</div>
      </motion.div>
      {index<total-1&&<div style={{color:'var(--text-3)',padding:'0 4px',flexShrink:0}}><ChevronRight size={14}/></div>}
    </motion.div>
  )
}

function FeatureCard({icon:Icon,label,desc,color}){
  return(
    <motion.div variants={fadeUp} whileHover={{y:-5,borderColor:`${color}66`}}
      style={{padding:'20px',borderRadius:14,background:'var(--surface)',border:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:10,transition:'border-color .3s',cursor:'default'}}>
      <div style={{width:38,height:38,borderRadius:10,background:`${color}16`,border:`1px solid ${color}44`,display:'flex',alignItems:'center',justifyContent:'center',color}}><Icon size={18} strokeWidth={1.8}/></div>
      <div>
        <div style={{fontFamily:'var(--font-display)',fontSize:13,fontWeight:700,color:'var(--text)',marginBottom:4}}>{label}</div>
        <div style={{fontSize:12,color:'var(--text-2)',lineHeight:1.5}}>{desc}</div>
      </div>
    </motion.div>
  )
}

function WelcomeDashboard(){
  const navigate=useNavigate()
  return(
    <motion.div variants={stagger} initial="hidden" animate="show" style={{maxWidth:900,margin:'0 auto'}}>
      <motion.div variants={fadeUp} style={{marginBottom:52,position:'relative'}}>
        <div style={{position:'absolute',top:-60,left:'50%',transform:'translateX(-50%)',width:600,height:260,borderRadius:'50%',background:'radial-gradient(ellipse,#00d4ff08 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'6px 14px',borderRadius:99,background:'var(--cyan-dim)',border:'1px solid var(--border-2)',marginBottom:20}}>
          <motion.div animate={{rotate:360}} transition={{duration:12,repeat:Infinity,ease:'linear'}}><FlaskConical size={12} color="var(--cyan)" strokeWidth={2.5}/></motion.div>
          <span style={{fontFamily:'var(--font-mono)',fontSize:10,fontWeight:700,color:'var(--cyan)',letterSpacing:'.1em',textTransform:'uppercase'}}>AutoML Platform — v3.1</span>
        </div>
        <h1 style={{fontFamily:'var(--font-display)',fontSize:'clamp(36px,6vw,68px)',fontWeight:800,lineHeight:1.0,letterSpacing:'-.04em',color:'var(--text)',marginBottom:18}}>
          Raw data.{' '}<span style={{background:'linear-gradient(135deg,#00d4ff,#9b6dff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Trained</span>{' '}intelligence.
        </h1>
        <p style={{fontSize:17,color:'var(--text-2)',lineHeight:1.75,maxWidth:540,marginBottom:36}}>
          Upload a CSV. We profile it, clean it, engineer features with AI, and train dozens of models. You get the best one — download-ready in minutes.
        </p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <motion.button whileHover={{scale:1.04,boxShadow:'0 0 50px #00d4ff33'}} whileTap={{scale:.97}} onClick={()=>navigate('/upload')}
            style={{display:'inline-flex',alignItems:'center',gap:10,padding:'14px 36px',borderRadius:12,background:'linear-gradient(135deg,#00d4ff22,#9b6dff11)',border:'1.5px solid var(--cyan)',color:'var(--cyan)',fontFamily:'var(--font-display)',fontSize:16,fontWeight:800,cursor:'pointer',letterSpacing:'-.02em',transition:'all .3s',position:'relative',overflow:'hidden'}}>
            <motion.div animate={{x:['-130%','230%']}} transition={{duration:3,repeat:Infinity,ease:'easeInOut',repeatDelay:1}} style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,#00d4ff18,transparent)',pointerEvents:'none'}}/>
            <Upload size={16}/> Upload your CSV <ArrowRight size={16}/>
          </motion.button>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} onClick={()=>navigate('/upload')}
            style={{display:'inline-flex',alignItems:'center',gap:8,padding:'14px 28px',borderRadius:12,background:'var(--surface)',border:'1px solid var(--border)',color:'var(--text-2)',fontFamily:'var(--font-sans)',fontSize:14,fontWeight:500,cursor:'pointer',transition:'all .2s'}}>
            <Sparkles size={14}/> See how it works
          </motion.button>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} style={{marginBottom:48}}>
        <div style={{fontFamily:'var(--font-mono)',fontSize:10,fontWeight:700,letterSpacing:'.14em',textTransform:'uppercase',color:'var(--text-3)',marginBottom:16}}>The Pipeline — 5 steps</div>
        <motion.div variants={stagger} style={{display:'flex',gap:6,alignItems:'center'}}>
          {PIPELINE.map((s,i)=><PipelineStep key={s.label} {...s} index={i} total={PIPELINE.length}/>)}
        </motion.div>
      </motion.div>

      <motion.div variants={fadeUp} style={{display:'flex',alignItems:'center',gap:12,marginBottom:32}}>
        <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-3)',letterSpacing:'.1em',textTransform:'uppercase'}}>Powered by</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
      </motion.div>

      <motion.div variants={stagger} style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:52}}>
        {FEATURES.map(f=><FeatureCard key={f.label} {...f}/>)}
      </motion.div>

      <motion.div variants={fadeUp} whileHover={{borderColor:'#00d4ff44'}}
        style={{borderRadius:20,border:'1px solid var(--border)',background:'var(--surface)',padding:'32px 36px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:24,flexWrap:'wrap',position:'relative',overflow:'hidden',transition:'border-color .3s'}}>
        <div style={{position:'absolute',top:-40,right:-40,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,#00d4ff0a 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontFamily:'var(--font-display)',fontSize:20,fontWeight:800,color:'var(--text)',marginBottom:6,letterSpacing:'-.025em'}}>Ready to transform your data?</div>
          <div style={{fontSize:13,color:'var(--text-2)',lineHeight:1.6}}>Upload any CSV or Excel — classification, regression, or let us detect it.</div>
        </div>
        <motion.button whileHover={{scale:1.05,boxShadow:'0 0 40px #00d4ff33'}} whileTap={{scale:.97}} onClick={()=>navigate('/upload')}
          style={{flexShrink:0,display:'inline-flex',alignItems:'center',gap:10,padding:'13px 32px',borderRadius:12,background:'var(--cyan-dim)',border:'1.5px solid var(--cyan)',color:'var(--cyan)',fontFamily:'var(--font-display)',fontSize:15,fontWeight:700,cursor:'pointer',transition:'all .3s',letterSpacing:'-.02em',position:'relative',overflow:'hidden',zIndex:1}}>
          <motion.div animate={{x:['-130%','230%']}} transition={{duration:2.5,repeat:Infinity,ease:'easeInOut',repeatDelay:1}} style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,#00d4ff1a,transparent)',pointerEvents:'none'}}/>
          Start the Alchemy <Zap size={15}/>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function Welcome(){
  const [phase,setPhase]=useState('intro')
  return(
    <>
      <AnimatePresence>{phase==='intro'&&<IntroOverlay onDone={()=>setPhase('reveal')}/>}</AnimatePresence>
      <AnimatePresence>
        {phase==='reveal'&&(
          <motion.div initial={{opacity:0,filter:'blur(14px)'}} animate={{opacity:1,filter:'blur(0px)'}} transition={{duration:.85,ease:[.22,1,.36,1]}} style={{minHeight:'100%'}}>
            <WelcomeDashboard/>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
