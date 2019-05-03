require "json"

package = JSON.parse(File.read(File.join(__dir__, "../package.json")))

Pod::Spec.new do |s|
  s.name         = "RNSpringScrollView"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = "https://github.com/bolan9999/react-native-spring-scrollview"
  s.license      = package["license"]
  s.author       = { "bolan9999" => "shanshang130@gmail.com" }
  s.platforms    = { :ios => "7.0", :tvos => "9.0" }
  s.source       = { :git => "https://github.com/bolan9999/react-native-spring-scrollview.git", :tag => s.version }
  s.source_files  = "SpringScrollView/**/*.{h,m}"
  s.requires_arc = true

  s.dependency "React"
end
