import { Link } from "wouter";
import { ArrowLeft, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-purple-900 dark:text-purple-400 mb-4" data-testid="text-page-title">
            Contact Us
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            We're here to help. Reach out to us through any of the following channels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card data-testid="card-phone-support">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Speak with our customer service team</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-400 mb-2">
                844-4TRUIST
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                (844-487-8478)
              </p>
              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM ET</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 5:00 PM ET</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-email-support">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <Mail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Send us your questions or concerns</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-purple-900 dark:text-purple-400 mb-2">
                support@truist.com
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We typically respond within 24 hours
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                For urgent matters, please call our phone support line.
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-headquarters">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Headquarters</CardTitle>
                  <CardDescription>Visit or write to us</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Truist Financial Corporation</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                214 N Tryon St<br />
                Charlotte, NC 28202<br />
                United States
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-branch-locator">
            <CardHeader>
              <CardTitle>Find a Branch or ATM</CardTitle>
              <CardDescription>Locate the nearest Truist location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use our branch locator to find the nearest Truist branch or ATM in your area.
              </p>
              <a 
                href="https://www.truist.com/locations" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="link-branch-locator"
              >
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Find Locations
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-400">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you need to report a lost or stolen card, or suspect fraudulent activity on your account:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <p className="font-semibold text-purple-900 dark:text-purple-400 mb-1">
                  Lost/Stolen Cards
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-400">
                  1-800-TRUIST-1
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Available 24/7</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-purple-900 dark:text-purple-400 mb-1">
                  Fraud Reporting
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-400">
                  1-888-FRAUD-01
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Available 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
