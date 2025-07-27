"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BrainCircuit, Clock, Users, ArrowRight, User, CalendarDays } from "lucide-react";
import { AiSessionForm } from "@/components/(custom)/manage-sessions/AiSessionForm";
import { motion } from "framer-motion";

// UPDATE: Added 'sessionDate' to the type to match the data from the server.
type UpcomingAiSession = {
    id: string;
    title: string;
    description: string | null;
    durationInMinutes: number;
    capacity: number;
    minCapacity: number;
    startTime: string; // This is the full ISO string for sorting/time display
    sessionDate: string; // This is the "YYYY-MM-DD" string
    creator: {
        name: string | null;
        imageUrl: string | null;
    } | null;
};

type AiCoursesClientProps = {
    scheduledSessions: UpcomingAiSession[];
    comingSoonCourse: {
        id: string;
        title: string;
        description: string;
        creator: string;
        status: string;
    };
};

// Animation variants for Framer Motion
const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
        },
    },
};

export function AiCoursesClient({ scheduledSessions, comingSoonCourse }: AiCoursesClientProps) {

    const nextFridaySession = scheduledSessions.find(s => new Date(s.startTime).getDay() === 5);
    const nextTuesdaySession = scheduledSessions.find(s => new Date(s.startTime).getDay() === 2);

    return (
        <div className="relative w-screen -translate-x-1/2 left-1/2 bg-slate-900 text-white -mt-8">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[450px] w-full overflow-hidden"
            >
                <img
                    src="/5ba7d039-effb-41ed-8bb8-51c1db70cfcc.jpg"
                    alt="AI Courses Background"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/80 to-slate-900" />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center p-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg"
                    >
                        Unlock the Power of AI
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-4 max-w-2xl text-lg text-slate-300 drop-shadow-md"
                    >
                        Dive into our exclusive, hands-on training sessions and master the future of technology.
                    </motion.p>
                </div>
            </motion.div>
            
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12">
                {/* Header with Add Session Button */}
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="grid gap-1">
                        <h2 className="text-3xl font-bold tracking-tight text-white">
                            Available Courses
                        </h2>
                        <p className="text-slate-400">
                            Book your spot in an upcoming session or check back for new topics.
                        </p>
                    </div>
                    <AiSessionForm />
                </div>

                {/* Highlighted Next Sessions */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                         <Card className="bg-slate-800/50 border-purple-500/50 h-full">
                             <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-purple-300">
                                     <CalendarDays className="h-5 w-5" /> Next Friday Session
                                 </CardTitle>
                                 <CardDescription className="text-slate-400">
                                     {nextFridaySession 
                                         ? `04:00 PM (Tunis Time)`
                                         : "To be scheduled"
                                     }
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                 <p className="font-semibold text-white">
                                     {nextFridaySession ? nextFridaySession.title : "No upcoming Friday session."}
                                 </p>
                             </CardContent>
                         </Card>
                     </motion.div>
                     <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{delay: 0.2}}>
                        <Card className="bg-slate-800/50 border-blue-500/50 h-full">
                              <CardHeader>
                                 <CardTitle className="flex items-center gap-2 text-blue-300">
                                     <CalendarDays className="h-5 w-5" /> Next Tuesday Session
                                 </CardTitle>
                                 <CardDescription className="text-slate-400">
                                      {nextTuesdaySession 
                                         ? `${new Date(nextTuesdaySession.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} (Tunis Time)`
                                         : "Instructors will be announced soon."
                                      }
                                 </CardDescription>
                             </CardHeader>
                             <CardContent>
                                <p className="font-semibold text-white">
                                      {nextTuesdaySession ? nextTuesdaySession.title : "No upcoming Tuesday session."}
                                 </p>
                             </CardContent>
                         </Card>
                     </motion.div>
                 </div>

                {/* Course List */}
                <div className="space-y-6">
                    {scheduledSessions && scheduledSessions.length > 0 ? (
                        scheduledSessions.map((session, index) => (
                            <motion.div
                                key={session.id}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="bg-slate-800/50 border border-slate-700/50 transition-all duration-300 hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-500/10">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold text-white">{session.title}</CardTitle>
                                            <Badge variant="outline" className="border-purple-400 text-purple-300">Live Session</Badge>
                                        </div>
                                        <CardDescription className="text-slate-400 pt-1">{session.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 border-t border-slate-700/50 pt-4">
                                        <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-purple-300" /><span>{session.durationInMinutes} min</span></div>
                                        <div className="flex items-center gap-2"><Users className="h-4 w-4 text-purple-300" /><span>{session.minCapacity}-{session.capacity} Participants</span></div>
                                        {/* UPDATE: This now correctly formats the full date from the server */}
                                        <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-purple-300" /><span>{new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
                                        {/* UPDATE: Added "Instructor:" label for clarity */}
                                        <div className="flex items-center gap-2"><User className="h-4 w-4 text-purple-300" /><span>{session.creator?.name || 'N/A'}</span></div>
                                    </CardContent>
                                      <div className="p-4 pt-0">
                                         <Link href={`/ai-sessions/${session.id}`} passHref> 
                                             <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold transition-all duration-300 transform hover:scale-105">
                                                 View Details & Book
                                                 <ArrowRight className="ml-2 h-4 w-4" />
                                             </Button>
                                         </Link>
                                     </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center py-16 rounded-lg bg-slate-800/50 border-2 border-dashed border-slate-700">
                            <BrainCircuit className="mx-auto h-12 w-12 text-slate-500" />
                            <h3 className="mt-4 text-lg font-semibold text-white">No Sessions Scheduled</h3>
                            <p className="mt-2 text-sm text-slate-400">
                                New AI training sessions are in the works. Please check back soon!
                            </p>
                        </div>
                    )}

                    {/* Coming Soon Card */}
                    <motion.div
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                    >
                         <Card className="bg-slate-800/50 border border-dashed border-slate-700/50">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-white">{comingSoonCourse.title}</CardTitle>
                                    <Badge variant="secondary">Coming Soon</Badge>
                                </div>
                                <CardDescription className="text-slate-400 pt-1">{comingSoonCourse.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between border-t border-slate-700/50 pt-4">
                               <div className="flex items-center gap-2 text-slate-300">
                                    <User className="h-4 w-4 text-purple-300" />
                                    <span>Instructor: {comingSoonCourse.creator}</span>
                               </div>
                                <Button size="sm" disabled>
                                    Details Soon
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
