'use client';

import * as z from 'zod';
import Heading from '@/components/heading';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { formSchema } from './constants';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { ChatCompletionRequestMessage } from 'openai';
import { Empty } from '@/components/Empty';
import { Loader } from '@/components/Loader';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/user-avatar';
import { BotAvatar } from '@/components/bot-avatar';
import { useProModel } from '@/hooks/use-pro-model';
import { toast } from 'react-hot-toast';
import { useMessageContext } from './MessageContext';

const ConversationPage = () => {
  const proModel = useProModel();
  const router = useRouter();
  const { messages, addMessage } = useMessageContext(); // Use the context here
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: 'user',
        content: values.prompt,
      };
      addMessage(userMessage);

      // const newMessages = [...messages, userMessage];

      const response = await axios.post('/api/conversation', {
        messages: [...messages, userMessage],
      });

      const botMessage: ChatCompletionRequestMessage = {
        role: 'assistant',
        content: response.data.content,
      };
      addMessage(botMessage);

      form.reset();
    } catch (error: any) {
      if (error?.response?.status === 403) {
        proModel.onOpen();
      } else {
        toast.error('Something Went Wrong');
      }
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title='Conversation'
        description='Our Most Advanced Conversation Model.'
        icon={MessageSquare}
        iconColor='text-violet-500'
        bgColor='bg-violet-500/10'
      />
      <div className='px-4 lg:px-8'>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within grid grid-cols-12 gap-2'>
              <FormField
                name='prompt'
                render={({ field }) => (
                  <FormItem className='col-span-12 lg:col-span-10'>
                    <FormControl className='m-0 p-0'>
                      <Input
                        className='border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                        disabled={isLoading}
                        placeholder='How Can I Help You In Conversations?'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className='col-span-12 lg:col-span-2 w-full'
                disabled={isLoading}>
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className='space-y-4 mt-4'>
          {isLoading && (
            <div className='p-8 rounded-lg w-full flex items-center justify-content bg-muted'>
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <div>
              <Empty label='No Conversation Started.' />
            </div>
          )}
          <div className='flex flex-col-reverse gap-y-4'>
            {messages.map((message) => (
              <div
                key={message.content}
                className={cn(
                  'p-8 w-full flex items-start gap-x-8 rounded-lg',
                  message.role === 'user'
                    ? 'bg-white border border-black/10'
                    : 'bg-muted'
                )}>
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <p className='text-sm'>{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
