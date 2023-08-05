'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useProModel } from '@/hooks/use-pro-model';
import { Badge } from './ui/badge';
import {
  Check,
  Code,
  ImageIcon,
  MessageSquare,
  Music,
  VideoIcon,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10',
    href: '/conversation',
  },
  {
    label: 'Music Generation',
    icon: Music,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    href: '/music',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    href: '/image',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    href: '/code',
  },
];
const ProModel = () => {
  const proModel = useProModel();
  const [loading,setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const response = axios.get("/api/stripe");
      window.location.href = (await response).data.url;
    } catch (error) {
      toast.error('Something Went Wrong');
    } finally {
      setLoading(false);
    }
  }


  return (
    <Dialog open={proModel.isOpen} onOpenChange={proModel.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex justify-center items-center flex-col gap-y-4 pb-2'>
            <div className='flex items-center gap-x-2 font-bold py-1'>
              Upgrade To Pro
              <Badge variant='premium' className='uppercase text-sm py-1'>
                Pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className='text-center pt-2 space-y-2 text-zinc-900 font-medium'>
            {tools.map((tool) => (
              <Card
                key={tool.label}
                className='flex items-center justify-between border-black/5 p-3'>
                <div className='flex items-center gap-x-4'>
                  <div className={cn('p-2 w-fit rounded-md', tool.bgColor)}>
                    <tool.icon className={cn('w-6 h-6', tool.color)} />
                  </div>
                  <div className='font-semibold text-sm'>{tool.label}</div>
                </div>
                <Check className='text-primary w-5 h-5' />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={loading}
            variant='premium'
            size='lg'
            className='w-full'
            onClick={onSubscribe}>
            Upgrade <Zap className='w-4 h-4 ml-2 fill-white' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModel; 
