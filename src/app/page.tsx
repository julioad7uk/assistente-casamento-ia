'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { Calendar, Users, DollarSign, CheckCircle, Clock, Heart, Plus, Edit, Trash2, MessageCircle, LogOut, User } from 'lucide-react'
import AuthWrapper from '@/components/AuthWrapper'
import { useAuth, useGuests, useVendors, useTasks, useBudget, useWeddingInfo } from '@/hooks/useSupabase'

export default function WeddingAssistant() {
  return (
    <AuthWrapper>
      <WeddingDashboard />
    </AuthWrapper>
  )
}

function WeddingDashboard() {
  const { user, signOut } = useAuth()
  const { guests, addGuest, updateGuest, deleteGuest } = useGuests()
  const { vendors, addVendor, updateVendor, deleteVendor } = useVendors()
  const { tasks, addTask, updateTask, deleteTask } = useTasks()
  const { budget, addBudgetItem, updateBudgetItem, deleteBudgetItem } = useBudget()
  const { weddingInfo, updateWeddingInfo } = useWeddingInfo()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Olá! Sou seu assistente de casamento com IA. Como posso ajudar você hoje?' }
  ])
  const [chatInput, setChatInput] = useState('')

  // Estados para formulários
  const [newGuest, setNewGuest] = useState({
    name: '', email: '', phone: '', confirmed: false, plus_one: false, dietary_restrictions: ''
  })
  const [newVendor, setNewVendor] = useState({
    name: '', category: '', contact: '', price: 0, status: 'Pendente', notes: ''
  })
  const [newTask, setNewTask] = useState({
    title: '', description: '', due_date: '', completed: false, priority: 'Média', category: 'Geral'
  })
  const [newBudgetItem, setNewBudgetItem] = useState({
    category: '', planned_amount: 0, actual_amount: 0, notes: ''
  })
  const [weddingForm, setWeddingForm] = useState({
    couple_names: weddingInfo?.couple_names || '',
    wedding_date: weddingInfo?.wedding_date || '',
    venue: weddingInfo?.venue || '',
    guest_count: weddingInfo?.guest_count || 0,
    budget_total: weddingInfo?.budget_total || 0,
    style: weddingInfo?.style || 'Clássico'
  })

  const handleAddGuest = async () => {
    if (newGuest.name) {
      await addGuest(newGuest)
      setNewGuest({ name: '', email: '', phone: '', confirmed: false, plus_one: false, dietary_restrictions: '' })
    }
  }

  const handleAddVendor = async () => {
    if (newVendor.name && newVendor.category) {
      await addVendor(newVendor)
      setNewVendor({ name: '', category: '', contact: '', price: 0, status: 'Pendente', notes: '' })
    }
  }

  const handleAddTask = async () => {
    if (newTask.title) {
      await addTask(newTask)
      setNewTask({ title: '', description: '', due_date: '', completed: false, priority: 'Média', category: 'Geral' })
    }
  }

  const handleAddBudgetItem = async () => {
    if (newBudgetItem.category) {
      await addBudgetItem(newBudgetItem)
      setNewBudgetItem({ category: '', planned_amount: 0, actual_amount: 0, notes: '' })
    }
  }

  const handleUpdateWeddingInfo = async () => {
    await updateWeddingInfo(weddingForm)
  }

  const handleChat = () => {
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, userMessage])

    // Simulação de resposta da IA
    setTimeout(() => {
      const responses = [
        'Baseado nas suas informações, sugiro focar nas tarefas com prazo mais próximo.',
        'Para seu orçamento, recomendo reservar 10% para imprevistos.',
        'Que tal enviar os convites 2 meses antes da data do casamento?',
        'Posso ajudar você a criar um cronograma detalhado para os próximos meses.',
        'Lembre-se de confirmar todos os fornecedores 1 semana antes do casamento.'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
    }, 1000)

    setChatInput('')
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const totalPlanned = budget.reduce((sum, item) => sum + item.planned_amount, 0)
  const totalSpent = budget.reduce((sum, item) => sum + item.actual_amount, 0)

  const confirmedGuests = guests.filter(guest => guest.confirmed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-900">Assistente de Casamento IA</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="guests">Convidados</TabsTrigger>
            <TabsTrigger value="vendors">Fornecedores</TabsTrigger>
            <TabsTrigger value="tasks">Tarefas</TabsTrigger>
            <TabsTrigger value="budget">Orçamento</TabsTrigger>
            <TabsTrigger value="chat">Chat IA</TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Configuração do Casamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  <span>Informações do Casamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="couple">Nomes do Casal</Label>
                    <Input
                      id="couple"
                      value={weddingForm.couple_names}
                      onChange={(e) => setWeddingForm(prev => ({ ...prev, couple_names: e.target.value }))}
                      placeholder="João & Maria"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Data do Casamento</Label>
                    <Input
                      id="date"
                      type="date"
                      value={weddingForm.wedding_date}
                      onChange={(e) => setWeddingForm(prev => ({ ...prev, wedding_date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="venue">Local</Label>
                    <Input
                      id="venue"
                      value={weddingForm.venue}
                      onChange={(e) => setWeddingForm(prev => ({ ...prev, venue: e.target.value }))}
                      placeholder="Igreja São José"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guests">Número de Convidados</Label>
                    <Input
                      id="guests"
                      type="number"
                      value={weddingForm.guest_count}
                      onChange={(e) => setWeddingForm(prev => ({ ...prev, guest_count: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">Orçamento Total</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={weddingForm.budget_total}
                      onChange={(e) => setWeddingForm(prev => ({ ...prev, budget_total: parseFloat(e.target.value) || 0 }))}
                      placeholder="50000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="style">Estilo do Casamento</Label>
                    <Select value={weddingForm.style} onValueChange={(value) => setWeddingForm(prev => ({ ...prev, style: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Clássico">Clássico</SelectItem>
                        <SelectItem value="Rústico">Rústico</SelectItem>
                        <SelectItem value="Moderno">Moderno</SelectItem>
                        <SelectItem value="Praia">Praia</SelectItem>
                        <SelectItem value="Jardim">Jardim</SelectItem>
                        <SelectItem value="Igreja">Igreja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleUpdateWeddingInfo} className="bg-pink-500 hover:bg-pink-600">
                  Salvar Informações
                </Button>
              </CardContent>
            </Card>

            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Convidados Confirmados</p>
                      <p className="text-2xl font-bold text-gray-900">{confirmedGuests}/{guests.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Orçamento Usado</p>
                      <p className="text-2xl font-bold text-gray-900">R$ {totalSpent.toLocaleString()}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tarefas Concluídas</p>
                      <p className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fornecedores</p>
                      <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progresso Geral */}
            <Card>
              <CardHeader>
                <CardTitle>Progresso do Planejamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Próximas Tarefas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Próximas Tarefas</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.filter(task => !task.completed).slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) => updateTask(task.id, { completed: !!checked })}
                        />
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600">{task.due_date}</p>
                        </div>
                      </div>
                      <Badge variant={task.priority === 'Alta' ? 'destructive' : task.priority === 'Média' ? 'default' : 'secondary'}>
                        {task.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Convidados */}
          <TabsContent value="guests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciar Convidados</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Convidado
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Convidado</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="guest-name">Nome</Label>
                          <Input
                            id="guest-name"
                            value={newGuest.name}
                            onChange={(e) => setNewGuest(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="guest-email">Email</Label>
                          <Input
                            id="guest-email"
                            type="email"
                            value={newGuest.email}
                            onChange={(e) => setNewGuest(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="guest-phone">Telefone</Label>
                          <Input
                            id="guest-phone"
                            value={newGuest.phone}
                            onChange={(e) => setNewGuest(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="guest-dietary">Restrições Alimentares</Label>
                          <Textarea
                            id="guest-dietary"
                            value={newGuest.dietary_restrictions}
                            onChange={(e) => setNewGuest(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="guest-plus-one"
                            checked={newGuest.plus_one}
                            onCheckedChange={(checked) => setNewGuest(prev => ({ ...prev, plus_one: !!checked }))}
                          />
                          <Label htmlFor="guest-plus-one">Acompanhante</Label>
                        </div>
                        <Button onClick={handleAddGuest} className="w-full bg-pink-500 hover:bg-pink-600">
                          Adicionar Convidado
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {guests.map((guest) => (
                    <div key={guest.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={guest.confirmed}
                          onCheckedChange={(checked) => updateGuest(guest.id, { confirmed: !!checked })}
                        />
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-sm text-gray-600">{guest.email}</p>
                          {guest.plus_one && <Badge variant="secondary">+1</Badge>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={guest.confirmed ? 'default' : 'secondary'}>
                          {guest.confirmed ? 'Confirmado' : 'Pendente'}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => deleteGuest(guest.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fornecedores */}
          <TabsContent value="vendors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciar Fornecedores</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Fornecedor
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Fornecedor</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="vendor-name">Nome</Label>
                          <Input
                            id="vendor-name"
                            value={newVendor.name}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="vendor-category">Categoria</Label>
                          <Select value={newVendor.category} onValueChange={(value) => setNewVendor(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fotografia">Fotografia</SelectItem>
                              <SelectItem value="Decoração">Decoração</SelectItem>
                              <SelectItem value="Buffet">Buffet</SelectItem>
                              <SelectItem value="Música">Música</SelectItem>
                              <SelectItem value="Flores">Flores</SelectItem>
                              <SelectItem value="Transporte">Transporte</SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="vendor-contact">Contato</Label>
                          <Input
                            id="vendor-contact"
                            value={newVendor.contact}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, contact: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="vendor-price">Preço</Label>
                          <Input
                            id="vendor-price"
                            type="number"
                            value={newVendor.price}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="vendor-notes">Observações</Label>
                          <Textarea
                            id="vendor-notes"
                            value={newVendor.notes}
                            onChange={(e) => setNewVendor(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                        <Button onClick={handleAddVendor} className="w-full bg-pink-500 hover:bg-pink-600">
                          Adicionar Fornecedor
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vendors.map((vendor) => (
                    <Card key={vendor.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{vendor.name}</h3>
                            <Button variant="outline" size="sm" onClick={() => deleteVendor(vendor.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Badge variant="outline">{vendor.category}</Badge>
                          <p className="text-sm text-gray-600">{vendor.contact}</p>
                          <p className="font-medium">R$ {vendor.price.toLocaleString()}</p>
                          <Badge variant={vendor.status === 'Confirmado' ? 'default' : 'secondary'}>
                            {vendor.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tarefas */}
          <TabsContent value="tasks" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciar Tarefas</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Tarefa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nova Tarefa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="task-title">Título</Label>
                          <Input
                            id="task-title"
                            value={newTask.title}
                            onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-description">Descrição</Label>
                          <Textarea
                            id="task-description"
                            value={newTask.description}
                            onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-date">Data de Vencimento</Label>
                          <Input
                            id="task-date"
                            type="date"
                            value={newTask.due_date}
                            onChange={(e) => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="task-priority">Prioridade</Label>
                          <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alta">Alta</SelectItem>
                              <SelectItem value="Média">Média</SelectItem>
                              <SelectItem value="Baixa">Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleAddTask} className="w-full bg-pink-500 hover:bg-pink-600">
                          Adicionar Tarefa
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={(checked) => updateTask(task.id, { completed: !!checked })}
                        />
                        <div>
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-600">{task.due_date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={task.priority === 'Alta' ? 'destructive' : task.priority === 'Média' ? 'default' : 'secondary'}>
                          {task.priority}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => deleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orçamento */}
          <TabsContent value="budget" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Gerenciar Orçamento</span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-pink-500 hover:bg-pink-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Item do Orçamento</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budget-category">Categoria</Label>
                          <Input
                            id="budget-category"
                            value={newBudgetItem.category}
                            onChange={(e) => setNewBudgetItem(prev => ({ ...prev, category: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget-planned">Valor Planejado</Label>
                          <Input
                            id="budget-planned"
                            type="number"
                            value={newBudgetItem.planned_amount}
                            onChange={(e) => setNewBudgetItem(prev => ({ ...prev, planned_amount: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget-actual">Valor Gasto</Label>
                          <Input
                            id="budget-actual"
                            type="number"
                            value={newBudgetItem.actual_amount}
                            onChange={(e) => setNewBudgetItem(prev => ({ ...prev, actual_amount: parseFloat(e.target.value) || 0 }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="budget-notes">Observações</Label>
                          <Textarea
                            id="budget-notes"
                            value={newBudgetItem.notes}
                            onChange={(e) => setNewBudgetItem(prev => ({ ...prev, notes: e.target.value }))}
                          />
                        </div>
                        <Button onClick={handleAddBudgetItem} className="w-full bg-pink-500 hover:bg-pink-600">
                          Adicionar Item
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-600">Orçamento Total</p>
                        <p className="text-2xl font-bold text-blue-600">R$ {totalPlanned.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-600">Total Gasto</p>
                        <p className="text-2xl font-bold text-green-600">R$ {totalSpent.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-sm text-gray-600">Restante</p>
                        <p className={`text-2xl font-bold ${totalPlanned - totalSpent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          R$ {(totalPlanned - totalSpent).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {budget.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm">
                      <div>
                        <p className="font-medium">{item.category}</p>
                        <p className="text-sm text-gray-600">
                          Planejado: R$ {item.planned_amount.toLocaleString()} | 
                          Gasto: R$ {item.actual_amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={item.actual_amount <= item.planned_amount ? 'default' : 'destructive'}>
                          {item.actual_amount <= item.planned_amount ? 'No Orçamento' : 'Acima do Orçamento'}
                        </Badge>
                        <Button variant="outline" size="sm" onClick={() => deleteBudgetItem(item.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat IA */}
          <TabsContent value="chat" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  <span>Chat com IA</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-pink-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Digite sua pergunta..."
                      onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                    />
                    <Button onClick={handleChat} className="bg-purple-500 hover:bg-purple-600">
                      Enviar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}