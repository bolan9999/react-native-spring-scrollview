
Pod::Spec.new do |s|
  s.name         = "RNSpringScrollView"
  s.version      = "1.0.0"
  s.summary      = "RNSpringScrollView"
  s.description  = <<-DESC
                  React Native Spring ScrollView V2 is a high performance cross-platform native bounces ScrollView for React Native.(iOS & Android)
                   DESC
  s.homepage     = "https://github.com/bolan9999/react-native-spring-scrollview"
  s.license      = "MIT"
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.author             = { "bolan9999" => "shanshang130@gmail.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/bolan9999/react-native-spring-scrollview.git", :tag => "master" }
  s.source_files  = "src/ios/SpringScrollView/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"

end

  