// import { useEffect, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Calendar } from "@/components/ui/calendar"
// import { format } from "date-fns"

export default function Page() {
  // const [barbeiros, setBarbeiros] = useState([])
  // const [servicos, setServicos] = useState([])
  // const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("")
  // const [servicoSelecionado, setServicoSelecionado] = useState("")
  // const [data, setData] = useState<Date | undefined>(undefined)

  // useEffect(() => {
  //   fetch("/api/barbeiros")
  //     .then(res => res.json())
  //     .then(data => setBarbeiros(data))

  //   fetch("/api/servicos")
  //     .then(res => res.json())
  //     .then(data => setServicos(data))
  // }, [])

  // async function handleSubmit(e: React.FormEvent) {
  //   e.preventDefault()
  //   if (!barbeiroSelecionado || !servicoSelecionado || !data) return

  //   const response = await fetch("/api/appointments", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       userId: "ID_DO_USUARIO", // substituir dinamicamente
  //       barberId: barbeiroSelecionado,
  //       serviceId: Number(servicoSelecionado),
  //       date: data.toISOString(),
  //     }),
  //   })

  //   const result = await response.json()
  //   if (response.ok) alert("Agendamento realizado com sucesso!")
  //   else alert(result.error || "Erro ao agendar")
  // }

  return (
    <>
      Aqui será a página de agendamento
    </>
    // <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
    //   <div>
    //     <Label>Escolha o barbeiro</Label>
    //     <Select onValueChange={setBarbeiroSelecionado}>
    //       <SelectTrigger>
    //         <SelectValue placeholder="Selecione um barbeiro" />
    //       </SelectTrigger>
    //       <SelectContent>
    //         {barbeiros.map((barbeiro: any) => (
    //           <SelectItem key={barbeiro.id} value={barbeiro.id}>{barbeiro.name}</SelectItem>
    //         ))}
    //       </SelectContent>
    //     </Select>
    //   </div>

    //   <div>
    //     <Label>Escolha o serviço</Label>
    //     <Select onValueChange={setServicoSelecionado}>
    //       <SelectTrigger>
    //         <SelectValue placeholder="Selecione um serviço" />
    //       </SelectTrigger>
    //       <SelectContent>
    //         {servicos.map((servico: any) => (
    //           <SelectItem key={servico.id} value={servico.id.toString()}>
    //             {servico.name} - R$ {servico.price.toFixed(2)}
    //           </SelectItem>
    //         ))}
    //       </SelectContent>
    //     </Select>
    //   </div>

    //   <div>
    //     <Label>Data do agendamento</Label>
    //     <Calendar
    //       mode="single"
    //       selected={data}
    //       onSelect={setData}
    //       className="rounded-md border shadow"
    //     />
    //     {data && <p className="text-sm mt-1">Selecionado: {format(data, 'dd/MM/yyyy')}</p>}
    //   </div>

    //   <Button type="submit" className="w-full">Agendar</Button>
    // </form>
  )
}
