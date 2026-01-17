import { Layout } from '@/components/layout/Layout';
import { PageWrapper, PageHeader, ContentGrid, SectionHeader } from '@/components/common';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Calculator, FlaskConical, Droplets, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  badge?: string;
}

const ToolCard = ({ title, description, icon, to, badge }: ToolCardProps) => (
  <Link to={to}>
    <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {icon}
          </div>
          {badge && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent text-accent-foreground">
              {badge}
            </span>
          )}
        </div>
        <CardTitle className="text-lg mt-4">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  </Link>
);

const Tools = () => {
  const { t } = useI18n();

  const calculators = [
    {
      title: t.tools.fertilizerCalculator,
      description: t.tools.fertilizerCalculatorDesc,
      icon: <FlaskConical className="h-6 w-6" />,
      to: '/tools/fertilizer-calculator',
      badge: t.tools.new,
    },
    {
      title: t.tools.dosageCalculator,
      description: t.tools.dosageCalculatorDesc,
      icon: <Droplets className="h-6 w-6" />,
      to: '/tools/dosage-calculator',
      badge: t.tools.comingSoon,
    },
    {
      title: t.tools.waterMixCalculator,
      description: t.tools.waterMixCalculatorDesc,
      icon: <Scale className="h-6 w-6" />,
      to: '/tools/water-mix',
      badge: t.tools.comingSoon,
    },
  ];

  return (
    <Layout>
      <PageWrapper>
        <PageHeader 
          title={t.tools.title} 
          subtitle={t.tools.subtitle}
        />

        <SectionHeader title={t.tools.calculators} />

        <ContentGrid columns={3}>
          {calculators.map((calc) => (
            <ToolCard key={calc.to} {...calc} />
          ))}
        </ContentGrid>
      </PageWrapper>
    </Layout>
  );
};

export default Tools;
