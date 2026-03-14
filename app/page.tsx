'use client'
import {useState} from 'react'

export default function Page(){

const questions=[
"Man sunku prašyti pagalbos.",
"Dažnai jaučiuosi nepastebėtas.",
"Bijau būti atstumtas.",
"Linkstu prisitaikyti prie kitų.",
"Dažnai save kritikuoju."
]

const [step,setStep]=useState(0)
const [answers,setAnswers]=useState<number[]>([])
const [email,setEmail]=useState("")
const [consent,setConsent]=useState(false)
const [done,setDone]=useState(false)

function answer(v:number){
const arr=[...answers]
arr[step]=v
setAnswers(arr)
if(step<questions.length-1)setStep(step+1)
}

function percent(){
return Math.round((answers.reduce((a,b)=>a+b,0)/(questions.length*4))*100)
}

if(done){
return(
<div style={{padding:40,fontFamily:"sans-serif"}}>
<h1>Rezultatas</h1>
<p>Tavo aktyvumo procentas: {percent()}%</p>
<input placeholder="El pastas" value={email} onChange={e=>setEmail(e.target.value)}/>
<br/><br/>
<label>
<input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/>
Sutinku gauti savo testo rezultatus ir susijusią informaciją el. paštu.
</label>
<br/><br/>
<button onClick={()=>alert("Vėliau čia prijungsime MailerLite")}>Gauti pilną analizę</button>
</div>
)
}

return(
<div style={{padding:40,fontFamily:"sans-serif"}}>
<h1>Testas</h1>
<div>Progresas {Math.round((step/questions.length)*100)}%</div>
<h2>{questions[step]}</h2>
<button onClick={()=>answer(0)}>Niekada</button>
<button onClick={()=>answer(1)}>Retai</button>
<button onClick={()=>answer(2)}>Kartais</button>
<button onClick={()=>answer(3)}>Dažnai</button>
<button onClick={()=>answer(4)}>Beveik visada</button>
<br/><br/>
{step===questions.length-1 && answers.length===questions.length && (
<button onClick={()=>setDone(true)}>Rezultatai</button>
)}
</div>
)
}