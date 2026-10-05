import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    MapPin, 
    Map, 
    LockKeyhole, 
    BarChart3, 
    MessageCircle, 
    Smartphone 
} from "lucide-react";

const FeaturesPage = () => {
    const features = [
        {
            title: 'Real-Time Tracking',
            description: 'Track your shipments in real-time with our advanced GPS technology and get instant updates.',
            icon: MapPin
        },
        {
            title: 'Smart Route Optimization',
            description: 'Optimize delivery routes automatically to save time and reduce costs.',
            icon: Map
        },
        {
            title: 'Secure Payments',
            description: 'Process payments securely with our integrated payment system.',
            icon: LockKeyhole
        },
        {
            title: 'Analytics Dashboard',
            description: 'Access comprehensive analytics and reports to make data-driven decisions.',
            icon: BarChart3
        },
        {
            title: 'Customer Support',
            description: '24/7 customer support to assist you with any queries or concerns.',
            icon: MessageCircle
        },
        {
            title: 'Mobile App',
            description: 'Manage your shipments on the go with our user-friendly mobile application.',
            icon: Smartphone
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            <div className="container mx-auto px-4 py-16 space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        Our Features
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Discover how Ship-Swift can transform your shipping experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <Card 
                                key={index} 
                                className="border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300"
                            >
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                        <IconComponent className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                <div className="text-center">
                    <Link href="/contact">
                        <Button size="lg" className="rounded-full px-8">
                            Get Started Today
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;