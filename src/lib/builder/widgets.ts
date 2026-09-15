/**
 * Widgets for the builder's custom sections — data only, like sections.ts.
 *
 * A custom section is a row of columns; each column is a stack of widgets.
 * Every widget declares its fields, and one schema form (FieldForm) edits all
 * of them, so adding a widget type is an entry here plus its markup in
 * components/builder/custom-section.tsx — no new editor code.
 */

export type FieldKind = "text" | "textarea" | "markdown" | "select" | "toggle" | "image" | "video" | "link" | "list";

export type Field = {
  key: string;
  label: string;
  kind: FieldKind;
  options?: { value: string; label: string }[];
  help?: string;
};

export type Widget = { id: string; type: string } & Record<string, unknown>;

export type ColumnWidth = "12" | "9" | "8" | "6" | "4" | "3";

export type Column = { id: string; width: ColumnWidth; widgets: Widget[] };

export type CustomProps = {
  background: "none" | "page" | "surface" | "soft" | "brand" | "dark";
  paddingTop: "none" | "sm" | "md" | "lg" | "xl";
  paddingBottom: "none" | "sm" | "md" | "lg" | "xl";
  width: "narrow" | "normal" | "wide" | "full";
  textAlign: "left" | "center";
  verticalAlign: "start" | "center" | "end";
  gap: "sm" | "md" | "lg";
  anchor: string;
  animate: boolean;
  columns: Column[];
};

const opts = (...pairs: [string, string][]) => pairs.map(([value, label]) => ({ value, label }));

const ASPECTS = opts(["auto", "Original"], ["16/9", "16:9 wide"], ["4/3", "4:3"], ["1/1", "Square"], ["9/16", "9:16 vertical"]);
const SPACING = opts(["none", "None"], ["sm", "Small"], ["md", "Medium"], ["lg", "Large"], ["xl", "Extra large"]);

export const WIDGETS: Record<
  string,
  { label: string; description: string; icon: string; fields: Field[]; defaults: Record<string, unknown> }
> = {
  heading: {
    label: "Heading",
    description: "A title, with an optional badge above it.",
    icon: "M6 4v16M18 4v16M6 12h12",
    fields: [
      { key: "eyebrow", label: "Badge above (optional)", kind: "text" },
      { key: "text", label: "Heading", kind: "text" },
      { key: "level", label: "Tag", kind: "select", options: opts(["h1", "H1 — page title"], ["h2", "H2 — section"], ["h3", "H3"], ["h4", "H4"]) },
      { key: "size", label: "Size", kind: "select", options: opts(["display", "Display"], ["xl", "Extra large"], ["lg", "Large"], ["md", "Medium"], ["sm", "Small"]) },
    ],
    defaults: { eyebrow: "", text: "Your heading here", level: "h2", size: "lg" },
  },
  text: {
    label: "Text",
    description: "Paragraphs with **bold**, links and lists.",
    icon: "M4 6h16M4 12h16M4 18h10",
    fields: [
      { key: "text", label: "Text", kind: "markdown", help: "Markdown: **bold**, [link](https://…), - list items." },
      { key: "size", label: "Size", kind: "select", options: opts(["lg", "Large"], ["md", "Normal"], ["sm", "Small"]) },
      { key: "tone", label: "Colour", kind: "select", options: opts(["default", "Normal"], ["muted", "Muted"]) },
    ],
    defaults: { text: "Write something useful here. **Bold**, [links](#call) and lists all work.", size: "md", tone: "default" },
  },
  image: {
    label: "Image",
    description: "An uploaded image.",
    icon: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M15.5 9.5h.01",
    fields: [
      { key: "image", label: "Image", kind: "image" },
      { key: "aspect", label: "Shape", kind: "select", options: ASPECTS },
      { key: "fit", label: "Fit", kind: "select", options: opts(["cover", "Fill the shape"], ["contain", "Show whole image"]) },
      { key: "rounded", label: "Rounded corners", kind: "toggle" },
      { key: "shadow", label: "Shadow", kind: "toggle" },
    ],
    defaults: { image: { src: "", alt: "" }, aspect: "16/9", fit: "cover", rounded: true, shadow: false },
  },
  video: {
    label: "Video",
    description: "An uploaded clip or a direct video link.",
    icon: "M3 5h13v14H3zM16 10l5-3v10l-5-3",
    fields: [
      { key: "video", label: "Video", kind: "video" },
      { key: "aspect", label: "Shape", kind: "select", options: ASPECTS },
      { key: "autoplay", label: "Autoplay (muted, looping)", kind: "toggle" },
      { key: "controls", label: "Show player controls", kind: "toggle" },
      { key: "rounded", label: "Rounded corners", kind: "toggle" },
    ],
    defaults: { video: { src: "", alt: "" }, aspect: "16/9", autoplay: true, controls: false, rounded: true },
  },
  button: {
    label: "Button",
    description: "A link styled as a button.",
    icon: "M4 8h16v8H4zM8 12h8",
    fields: [
      { key: "cta", label: "Button", kind: "link", help: "#call opens the call booking, #contact the appointment calendar, #demo the voice demo." },
      { key: "variant", label: "Style", kind: "select", options: opts(["primary", "Brand gradient"], ["outline", "Outline"], ["white", "White"]) },
      { key: "size", label: "Size", kind: "select", options: opts(["md", "Normal"], ["lg", "Large"]) },
      { key: "fullWidth", label: "Full width", kind: "toggle" },
    ],
    defaults: { cta: { label: "Book A Call Now", href: "#call" }, variant: "primary", size: "md", fullWidth: false },
  },
  list: {
    label: "List",
    description: "Points with check marks, bullets or numbers.",
    icon: "M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2",
    fields: [
      { key: "items", label: "Points", kind: "list" },
      { key: "style", label: "Marker", kind: "select", options: opts(["check", "Check marks"], ["bullet", "Bullets"], ["number", "Numbers"]) },
    ],
    defaults: { items: ["First point", "Second point", "Third point"], style: "check" },
  },
  card: {
    label: "Card",
    description: "Image, title, text and a button in a box.",
    icon: "M4 4h16v16H4zM4 12h16",
    fields: [
      { key: "image", label: "Image (optional)", kind: "image" },
      { key: "title", label: "Title", kind: "text" },
      { key: "body", label: "Text", kind: "markdown" },
      { key: "cta", label: "Button (leave label empty to hide)", kind: "link" },
      { key: "style", label: "Style", kind: "select", options: opts(["surface", "Soft grey"], ["outline", "Outline"], ["brand", "Brand gradient"]) },
    ],
    defaults: {
      image: { src: "", alt: "" },
      title: "Card title",
      body: "A short description of this point.",
      cta: { label: "", href: "#call" },
      style: "surface",
    },
  },
  stat: {
    label: "Stat",
    description: "A big number with a label.",
    icon: "M4 20V10M10 20V4M16 20v-7M22 20H2",
    fields: [
      { key: "value", label: "Number", kind: "text" },
      { key: "label", label: "Label", kind: "text" },
    ],
    defaults: { value: "1,937", label: "Funnel visits" },
  },
  spacer: {
    label: "Spacer",
    description: "Empty vertical space.",
    icon: "M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4",
    fields: [{ key: "size", label: "Height", kind: "select", options: SPACING.slice(1) }],
    defaults: { size: "md" },
  },
  divider: {
    label: "Divider",
    description: "A thin horizontal line.",
    icon: "M3 12h18",
    fields: [],
    defaults: {},
  },
  embed: {
    label: "Embed",
    description: "Paste an iframe or embed code.",
    icon: "m16 18 6-6-6-6M8 6l-6 6 6 6",
    fields: [
      {
        key: "html",
        label: "Embed code",
        kind: "textarea",
        help: "iframes and embed markup. Scripts inside do not run — use the provider's iframe version.",
      },
    ],
    defaults: { html: "" },
  },
};

export const SECTION_FIELDS: Field[] = [
  {
    key: "background",
    label: "Background",
    kind: "select",
    options: opts(["none", "None"], ["page", "Page grey"], ["surface", "Soft grey"], ["soft", "Soft brand"], ["brand", "Brand gradient"], ["dark", "Dark"]),
  },
  { key: "paddingTop", label: "Space above", kind: "select", options: SPACING },
  { key: "paddingBottom", label: "Space below", kind: "select", options: SPACING },
  { key: "width", label: "Content width", kind: "select", options: opts(["narrow", "Narrow (760px)"], ["normal", "Normal"], ["wide", "Wide"], ["full", "Full width"]) },
  { key: "textAlign", label: "Text alignment", kind: "select", options: opts(["left", "Left"], ["center", "Centre"]) },
  { key: "verticalAlign", label: "Column alignment", kind: "select", options: opts(["start", "Top"], ["center", "Middle"], ["end", "Bottom"]) },
  { key: "gap", label: "Space between columns", kind: "select", options: opts(["sm", "Small"], ["md", "Medium"], ["lg", "Large"]) },
  { key: "anchor", label: "Anchor", kind: "text", help: "Letters and dashes. Link to this section with #anchor." },
  { key: "animate", label: "Fade in on scroll", kind: "toggle" },
];

export const COLUMN_WIDTHS: { value: ColumnWidth; label: string }[] = [
  { value: "12", label: "Full" },
  { value: "9", label: "3/4" },
  { value: "8", label: "2/3" },
  { value: "6", label: "1/2" },
  { value: "4", label: "1/3" },
  { value: "3", label: "1/4" },
];

/* ------------------------------------------------------------ factories -- */

const rid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

export function newWidget(type: string, overrides: Record<string, unknown> = {}): Widget {
  return { id: rid("w"), type, ...structuredClone(WIDGETS[type]?.defaults ?? {}), ...overrides };
}

export function newColumn(width: ColumnWidth, widgets: Widget[] = []): Column {
  return { id: rid("c"), width, widgets };
}

const base = (): Omit<CustomProps, "columns"> => ({
  background: "none",
  paddingTop: "lg",
  paddingBottom: "lg",
  width: "normal",
  textAlign: "left",
  verticalAlign: "center",
  gap: "md",
  anchor: "",
  animate: true,
});

export const CUSTOM_PRESETS: { key: string; label: string; description: string; build: () => CustomProps }[] = [
  {
    key: "blank",
    label: "Blank section",
    description: "One column with a heading and some text.",
    build: () => ({ ...base(), columns: [newColumn("12", [newWidget("heading"), newWidget("text")])] }),
  },
  {
    key: "text-image",
    label: "Text + image",
    description: "Copy and a button beside an image.",
    build: () => ({
      ...base(),
      columns: [
        newColumn("6", [newWidget("heading", { eyebrow: "WHY IT WORKS" }), newWidget("text"), newWidget("list"), newWidget("button")]),
        newColumn("6", [newWidget("image", { aspect: "4/3" })]),
      ],
    }),
  },
  {
    key: "cards",
    label: "Three cards",
    description: "A heading over three cards.",
    build: () => ({
      ...base(),
      textAlign: "left",
      verticalAlign: "start",
      columns: [
        newColumn("12", [newWidget("heading", { text: "Everything you need", size: "xl" })]),
        newColumn("4", [newWidget("card", { title: "Capture" })]),
        newColumn("4", [newWidget("card", { title: "Respond" })]),
        newColumn("4", [newWidget("card", { title: "Book" })]),
      ],
    }),
  },
  {
    key: "cta",
    label: "Call to action band",
    description: "Centred heading, text and a button on the brand gradient.",
    build: () => ({
      ...base(),
      background: "brand",
      textAlign: "center",
      width: "narrow",
      columns: [
        newColumn("12", [
          newWidget("heading", { text: "Ready to stop missing leads?", size: "xl" }),
          newWidget("text", { text: "Book a short call and see it working on your own numbers.", size: "lg" }),
          newWidget("button", { variant: "white", size: "lg" }),
        ]),
      ],
    }),
  },
  {
    key: "stats",
    label: "Stats row",
    description: "Four numbers side by side.",
    build: () => ({
      ...base(),
      background: "surface",
      textAlign: "center",
      paddingTop: "md",
      paddingBottom: "md",
      columns: [
        newColumn("3", [newWidget("stat", { value: "1,937", label: "Funnel visits" })]),
        newColumn("3", [newWidget("stat", { value: "39", label: "New conversions" })]),
        newColumn("3", [newWidget("stat", { value: "24/7", label: "AI answering" })]),
        newColumn("3", [newWidget("stat", { value: "< 60s", label: "Response time" })]),
      ],
    }),
  },
  {
    key: "video",
    label: "Video",
    description: "A centred heading above a video.",
    build: () => ({
      ...base(),
      textAlign: "center",
      columns: [newColumn("12", [newWidget("heading", { text: "See it in action", size: "xl" }), newWidget("video")])],
    }),
  },
];
