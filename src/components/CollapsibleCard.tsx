import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronUp } from "lucide-react"

export function CollapsibleCard({ header, content }: { header?: React.ReactNode, content?: React.ReactNode }) {
    const [open, setOpen] = React.useState(true)

    return (
        <div className="rounded-md border border-[rgba(116,82,245,0.12)] bg-white/80 p-3 shadow-sm">
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger className="w-full">
                    <div className="flex w-full cursor-pointer items-center justify-between text-sm font-medium transition-colors hover:text-foreground/80">
                        {header}
                        {
                            open
                                ? (<ChevronUp className="h-4 w-4" />)
                                : (<ChevronUp className="h-4 w-4 rotate-180" />)
                        }
                    </div>
                </CollapsibleTrigger>
                <CollapsibleContent>{content}</CollapsibleContent>
            </Collapsible>
        </div>
    )
}