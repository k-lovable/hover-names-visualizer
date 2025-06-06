
import { Container } from "@/components/ui/container";
import FileUpload from "@/components/FileUpload";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-6">
        <Container>
          <h1 className="text-2xl font-bold">Name Visualizer</h1>
          <p className="text-muted-foreground">Upload a JSON file to visualize names on an image</p>
        </Container>
      </header>
      
      <main className="flex-1 py-12">
        <Container>
          <FileUpload />
        </Container>
      </main>
    </div>
  );
};

export default Index;
