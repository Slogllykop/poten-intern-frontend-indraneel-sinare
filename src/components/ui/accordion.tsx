import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
    return (
        <AccordionPrimitive.Root
            data-slot="accordion"
            className={cn("flex w-full flex-col", className)}
            {...props}
        />
    );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
    return (
        <AccordionPrimitive.Item
            data-slot="accordion-item"
            className={cn("transition-all duration-200", className)}
            {...props}
        />
    );
}

function AccordionTrigger({
    className,
    children,
    showChevron = false,
    ...props
}: AccordionPrimitive.Trigger.Props & { showChevron?: boolean }) {
    return (
        <AccordionPrimitive.Header className="flex w-full">
            <AccordionPrimitive.Trigger
                data-slot="accordion-trigger"
                className={cn(
                    "group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 text-left font-medium outline-none transition-all aria-disabled:pointer-events-none aria-disabled:opacity-50",
                    className,
                )}
                {...props}
            >
                {children}
                {showChevron && (
                    <span className="ml-auto flex shrink-0 items-center text-muted-foreground">
                        <IconChevronDown
                            data-slot="accordion-trigger-icon"
                            className="pointer-events-none size-4 shrink-0 group-aria-expanded/accordion-trigger:hidden"
                        />
                        <IconChevronUp
                            data-slot="accordion-trigger-icon"
                            className="pointer-events-none hidden size-4 shrink-0 group-aria-expanded/accordion-trigger:inline"
                        />
                    </span>
                )}
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({
    className,
    children,
    ...props
}: AccordionPrimitive.Panel.Props) {
    return (
        <AccordionPrimitive.Panel
            data-slot="accordion-content"
            className="overflow-hidden data-closed:animate-accordion-up data-open:animate-accordion-down"
            {...props}
        >
            <div
                className={cn(
                    "h-(--accordion-panel-height) data-ending-style:h-0 data-starting-style:h-0",
                    className,
                )}
            >
                {children}
            </div>
        </AccordionPrimitive.Panel>
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
