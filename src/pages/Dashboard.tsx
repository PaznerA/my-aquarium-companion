import { Layout } from '@/components/layout/Layout';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { AquariumCard } from '@/components/dashboard/AquariumCard';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { AddAquariumDialog } from '@/components/forms/AddAquariumDialog';
import { AddTaskDialog } from '@/components/forms/AddTaskDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAppData } from '@/hooks/useAppData';

const Dashboard = () => {
  const {
    data,
    addAquarium,
    addTask,
    toggleTask,
    deleteTask,
  } = useAppData();

  const pendingTasks = data.tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Přehled vašich akvárií</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Quick Stats */}
        <QuickStats data={data} />

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Aquariums */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Akvária</h2>
              <AddAquariumDialog onAdd={addAquarium} />
            </div>
            {data.aquariums.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Zatím nemáte žádné akvárium</p>
                <p className="text-sm">Přidejte své první akvárium</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.aquariums.map((aquarium) => (
                  <AquariumCard
                    key={aquarium.id}
                    aquarium={aquarium}
                    fishCount={data.fish.filter(f => f.aquariumId === aquarium.id).reduce((acc, f) => acc + f.count, 0)}
                    plantCount={data.plants.filter(p => p.aquariumId === aquarium.id).reduce((acc, p) => acc + p.count, 0)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Tasks */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Úkoly</h2>
              <AddTaskDialog aquariums={data.aquariums} onAdd={addTask} />
            </div>
            {pendingTasks.length === 0 ? (
              <div className="border-2 border-dashed p-8 text-center text-muted-foreground">
                <p>Žádné nevyřízené úkoly</p>
                <p className="text-sm">Vytvořte připomenutí údržby</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    aquariumName={data.aquariums.find(a => a.id === task.aquariumId)?.name}
                    onToggle={() => toggleTask(task.id)}
                    onDelete={() => deleteTask(task.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
